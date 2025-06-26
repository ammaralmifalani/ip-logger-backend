const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://craftedbyammar.vercel.app",
  })
);
const PORT = process.env.PORT || 3000;
const IPINFO_TOKEN = "de88af926fdda7"; // jouw API token

app.get("/log-ip", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "onbekend";

  console.log("📥 IP-bezoek:", ip);

  try {
    const response = await fetch(
      `https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`
    );
    const data = await response.json();

    const city = data.city || "onbekend";
    const country = data.country || "onbekend";

    console.log(`🌍 Locatie: ${city}, ${country}`);
  } catch (err) {
    console.warn("❌ Locatie ophalen mislukt:", err.message);
  }

  res.send("✅ IP gelogd");
});

app.post("/log-location", (req, res) => {
  const { lat, lon } = req.body;

  if (lat && lon) {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    console.log(`📍 Gebruiker locatie: ${lat}, ${lon}`);
    console.log(`🗺️ Google Maps link: ${mapUrl}`);
  } else {
    console.warn("⚠️ Coördinaten ontbreken of ongeldig.");
  }

  res.send("Locatie ontvangen");
});

app.listen(PORT, () => {
  console.log(`🚀 Server draait op poort ${PORT}`);
});
