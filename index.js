// ====================================
// 🌙 Noor Telegram Bot + Website (One File)
// ====================================

// 🔹 প্যাকেজ ইমপোর্ট
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose"); // ✅ MongoDB এর জন্য

// =====================
// 🔹 কনফিগারেশন
// =====================
const BOT_TOKEN = "8307883574:AAGAfSeGo-VrjJeoait3urC3dhV19QNXPKc"; // ← তোমার টেলিগ্রাম বট টোকেন
const PORT = 3000; // সার্ভার পোর্ট
const WEB_URL = "https://zachery-unscared-garry.ngrok-free.dev"; // ← তোমার ওয়েবসাইট বা ngrok URL
const MONGO_URI = "mongodb+srv://MyDatabase:Cp8rNCfi15IUC6uc@cluster0.kjbloky.mongodb.net/"; // ← তোমার MongoDB URI

// =====================
// 🔹 MongoDB কানেকশন
// =====================
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🔹 Schema & Model
const clickSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});
const Click = mongoose.model("Click", clickSchema);

// =====================
// 🔹 Express সার্ভার সেটআপ
// =====================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// 🔹 হোম পেজ
// =====================
app.get("/", async (req, res) => {
  let counter = await Click.findOne();
  if (!counter) {
    counter = await Click.create({ count: 0 });
  }

  res.send(`
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>🌙 Noor</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      background: linear-gradient(135deg, #0a0a0a, #1f1f1f);
      color: white;
      font-family: sans-serif;
      text-align: center;
      padding-top: 100px;
    }
    h1 { font-size: 32px; margin-bottom: 15px; }
    p { font-size: 18px; color: #ccc; margin-bottom: 25px; }
    button {
      background-color: #00c896;
      border: none;
      padding: 15px 30px;
      font-size: 18px;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;
    }
    button:hover { background-color: #00a87a; }
    .counter {
      font-size: 20px;
      color: #00ffae;
      margin-top: 25px;
    }
  </style>

  <script src='//libtl.com/sdk.js' data-zone='10073167' data-sdk='show_10073167'></script>
</head>
<body>
  <h1>🌙 Noor Web</h1>
  <p>বিজ্ঞাপন দেখতে নিচে ক্লিক করুন 👇</p>
  <button id="showAd">🎬 Show Ad</button>

  <div class="counter">মোট ক্লিক: <span id="count">${counter.count}</span></div>

  <script>
    document.getElementById('showAd').addEventListener('click', async () => {
      // ✅ MongoDB তে ক্লিক সেভ করার রিকোয়েস্ট পাঠানো
      try {
        const res = await fetch('/clicked', { method: 'POST' });
        const data = await res.json();
        document.getElementById('count').innerText = data.count;
      } catch (err) {
        console.error(err);
      }

      // ✅ Monetag Direct Link — তোমার আসল লিংক নিচে বসাও
      window.location.href = 'https://otieu.com/4/10073188';
    });
  </script>
</body>
</html>
  `);
});

// =====================
// 🔹 ক্লিক API রুট
// =====================
app.post("/clicked", async (req, res) => {
  let counter = await Click.findOne();
  if (!counter) {
    counter = await Click.create({ count: 0 });
  }
  counter.count += 1;
  await counter.save();
  res.json({ count: counter.count });
});

// =====================
// 🔹 Telegram Bot সেটআপ
// =====================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// /start কমান্ড হ্যান্ডলার
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [[{ text: "🌙 Open Noor", url: WEB_URL }]],
    },
  };

  bot.sendMessage(
    chatId,
    "👋 আসসালামু আলাইকুম!\nনিচের বাটনে ক্লিক করে 🌙 Noor খুলুন 👇",
    keyboard
  );
});

// =====================
// 🔹 সার্ভার চালানো
// =====================
app.listen(PORT, () => {
  console.log(`✅ Noor Server চলছে: http://localhost:${PORT}`);
  console.log("✅ Telegram Bot চালু হয়েছে...");
});