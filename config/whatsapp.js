const axios = require("axios");
require("dotenv").config();

const BASE_URL = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;
const HEADERS = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

// ─── Send plain text ──────────────────────────────────────
async function sendText(to, text) {
  await axios.post(
    BASE_URL,
    { messaging_product: "whatsapp", to, type: "text", text: { body: text } },
    { headers: HEADERS }
  );
}

// ─── Send reply buttons ───────────────────────────────────
async function sendButtons(to, bodyText, buttons) {
  await axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.map((b) => ({
            type: "reply",
            reply: { id: b.id, title: b.title },
          })),
        },
      },
    },
    { headers: HEADERS }
  );
}

// ─── Send list message (radio buttons) ───────────────────
async function sendList(to, headerText, bodyText, buttonText, sections) {
  await axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: headerText },
        body: { text: bodyText },
        action: { button: buttonText, sections },
      },
    },
    { headers: HEADERS }
  );
}

// ─── Send WhatsApp Catalogue ──────────────────────────────
async function sendCatalogue(to) {
  await axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "catalog_message",
        body: { text: "🍛 Browse our full Chettinadu menu!" },
        footer: { text: "Tap an item to add to cart" },
        action: {
          name: "catalog_message",
          parameters: {
            thumbnail_product_retailer_id: "FIRST_PRODUCT_RETAILER_ID",
          },
        },
      },
    },
    { headers: HEADERS }
  );
}

// ─── Send WhatsApp Flow (Delivery Details Form) ───────────
async function sendDeliveryFlow(to, cartSummary) {
  await axios.post(
    BASE_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "flow",
        header: { type: "text", text: "📦 Delivery Details" },
        body: { text: `${cartSummary}\n\nFill your delivery details below:` },
        footer: { text: "Kavi Chettinadu Restaurant" },
        action: {
          name: "flow",
          parameters: {
            flow_message_version: "3",
            flow_token: `delivery_${to}_${Date.now()}`,
            flow_id: process.env.FLOW_ID,
            flow_cta: "Enter Delivery Details",
            flow_action: "navigate",
            flow_action_payload: {
              screen: "DELIVERY_SCREEN",
              data: { cart_summary: cartSummary },
            },
          },
        },
      },
    },
    { headers: HEADERS }
  );
}

// ─── Send Order Confirmation ──────────────────────────────
async function sendOrderConfirmation(to, order) {
  let itemsList = order.items
    .map((i) => `• ${i.name} × ${i.quantity} = ₹${i.price * i.quantity}`)
    .join("\n");

  await sendText(
    to,
    `🎉 *ORDER PLACED!*\n\n📋 Order ID: #${order.orderId}\n\n*Items:*\n${itemsList}\n\n💰 Total: ₹${order.totalAmount}\n💳 Payment: ${order.paymentMethod}\n🏠 Address: ${order.address}\n\n⏱️ Est. Delivery: 30 mins\n\nThank you for ordering from Kavi Chettinadu! 🍛`
  );

  await sendButtons(to, "What would you like to do next?", [
    { id: "order_again", title: "🔄 Order Again" },
    { id: "exit", title: "❌ Exit" },
  ]);
}

module.exports = {
  sendText,
  sendButtons,
  sendList,
  sendCatalogue,
  sendDeliveryFlow,
  sendOrderConfirmation,
};