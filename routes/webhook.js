const express = require("express");
const router = express.Router();
const { handleMessage } = require("../controllers/botController");

// ── GET /webhook — Meta verification ─────────────────────
router.get("/", (req, res) => {
  const mode      = req.query["hub.mode"];
  const token     = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
});

// ── POST /webhook — Incoming WhatsApp Messages ────────────
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") {
      return res.sendStatus(404);
    }

    const entry    = body.entry?.[0];
    const changes  = entry?.changes?.[0];
    const value    = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return res.sendStatus(200);
    }

    const msg  = messages[0];
    const from = msg.from;

    let messageBody    = "";
    let interactiveReply = null;
    let locationData   = null;
    let catalogueOrder = null;

    // ── Text Message ──────────────────────────────────────
    if (msg.type === "text") {
      messageBody = msg.text?.body || "";
    }

    // ── Interactive (Button / List / Flow) ────────────────
    else if (msg.type === "interactive") {

      // Button reply
      if (msg.interactive?.type === "button_reply") {
        interactiveReply = msg.interactive.button_reply;
      }

      // List reply
      else if (msg.interactive?.type === "list_reply") {
        interactiveReply = msg.interactive.list_reply;
      }

      // ✅ FIXED — Flow completion (nfm_reply)
      // Flow response is fully handled by /flow/endpoint (AES encrypted).
      // The nfm_reply that arrives here is just a webhook notification —
      // no need to pass it to handleMessage. Just log and acknowledge.
      else if (msg.interactive?.type === "nfm_reply") {
        console.log("📋 Flow nfm_reply received — handled by /flow/endpoint");
        return res.sendStatus(200);
      }
    }

    // ── Catalogue Order (user taps order from catalogue) ──
    else if (msg.type === "order") {
      catalogueOrder = msg.order;
      console.log("🛒 Catalogue order received:", JSON.stringify(catalogueOrder, null, 2));
    }

    // ── Location ──────────────────────────────────────────
    else if (msg.type === "location") {
      const loc = msg.location;
      locationData = {
        lat:     loc.latitude,
        lng:     loc.longitude,
        address: loc.address || loc.name || `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`,
      };
      console.log("📍 Location received:", locationData);
    }

    // ── Logs ──────────────────────────────────────────────
    console.log("\n📩 Incoming WhatsApp Message");
    console.log("👤 From:", from);
    console.log("💬 Message:", messageBody);
    console.log("⚡ Interactive:", interactiveReply);

    // ── Handle Bot Logic ──────────────────────────────────
    await handleMessage(from, messageBody, interactiveReply, locationData, catalogueOrder);

    return res.sendStatus(200);

  } catch (err) {
    console.error("\n❌ Webhook Processing Error");
    if (err.response?.data) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    return res.sendStatus(200);
  }
});

module.exports = router;