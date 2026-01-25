require("dotenv").config();
const express = require("express");
const { handleMessage } = require("./flow");

const app = express();
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Coworking WhatsApp Bot is running");
});

// Webhook verification (Meta check)
app.get("/webhook/whatsapp", (req, res) => {
  const verifyToken = "verify123"; // must match Meta
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Incoming WhatsApp messages
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "";
      await handleMessage(from, text);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
