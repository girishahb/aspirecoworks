const pool = require("./db");
const { sendMessage } = require("./whatsapp");

async function handleMessage(phone, text) {
  text = text || "";

  if (text.toLowerCase().includes("hi")) {
    // Auto-reply with options
    await sendMessage(
      phone,
      "Welcome to our Coworking Space! 😊\nReply:\n1️⃣ Book a desk\n2️⃣ Private office\n3️⃣ Pricing info"
    );
  } else {
    // Save lead to Neon
    await pool.query(
      "INSERT INTO coworking_leads(phone, lead_status) VALUES($1,$2)",
      [phone, "NEW"]
    );
    // Auto-reply
    await sendMessage(phone, "Thanks! Our team will contact you shortly.");
  }
}

module.exports = { handleMessage };
