const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔍 IP-log endpoint
app.get("/log-ip", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "onbekend";

  console.log("📥 IP-bezoek:", ip);

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const city = data?.city || "onbekend";
    const country = data?.country_name || "onbekend";

    console.log(`🌍 Locatie: ${city}, ${country}`);
    res.status(200).send(`✅ IP gelogd: ${city}, ${country}`);
  } catch (err) {
    console.warn("❌ Locatie ophalen mislukt:", err.message);
    res.status(500).send("❌ Fout bij ophalen van locatiegegevens");
  }
});

// 📍 Locatie-log endpoint via browser
app.post("/log-location", (req, res) => {
  const { lat, lon } = req.body;

  if (typeof lat === "number" && typeof lon === "number") {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    console.log(`📍 Gebruiker locatie: ${lat}, ${lon}`);
    console.log(`🗺️ Google Maps link: ${mapUrl}`);
    res.status(200).send("📌 Locatie ontvangen en gelogd");
  } else {
    console.warn("⚠️ Coördinaten ontbreken of ongeldig:", req.body);
    res.status(400).send("⚠️ Ongeldige locatiegegevens");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server draait op poort ${PORT}`);
});
