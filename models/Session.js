// In-memory session store (cart per user)
const sessions = {};

function getSession(phone) {
  if (!sessions[phone]) {
    sessions[phone] = { cart: [], step: "start", name: "", address: "" };
  }
  return sessions[phone];
}

function clearSession(phone) {
  sessions[phone] = { cart: [], step: "start", name: "", address: "" };
}

function addToCart(phone, item) {
  const session = getSession(phone);
  const existing = session.cart.find((i) => i.name === item.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    session.cart.push({ ...item, quantity: 1 });
  }
}

function getCartTotal(phone) {
  const session = getSession(phone);
  return session.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function getCartSummary(phone) {
  const session = getSession(phone);
  if (session.cart.length === 0) return "🛒 Cart is empty";
  let text = "🛒 Your Cart:\n";
  session.cart.forEach((i) => {
    text += `• ${i.name} × ${i.quantity} = ₹${i.price * i.quantity}\n`;
  });
  text += `\n💰 *Total: ₹${getCartTotal(phone)}*`;
  return text;
}

module.exports = {
  getSession,
  clearSession,
  addToCart,
  getCartTotal,
  getCartSummary,
};