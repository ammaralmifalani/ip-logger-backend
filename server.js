const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/log-ip", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  console.log("📥 IP-bezoek:", ip);

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    console.log(`🌍 Locatie: ${data.city}, ${data.country_name}`);
  } catch (err) {
    console.warn("❌ Locatie ophalen mislukt:", err.message);
  }

  res.send("IP gelogd");
});

app.listen(PORT, () => {
  console.log(`🚀 Server draait op poort ${PORT}`);
});
