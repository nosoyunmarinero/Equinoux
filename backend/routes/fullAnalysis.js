import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "You must provide a URL in the request body" });
  }

  console.log("🔍 Starting analysis of:", url);

  let lighthouseRes, puppeteerRes, axeRes;

  // 🔹 Lighthouse
  try {
    console.log("⚡ Calling Lighthouse...");
    const response = await axios.post("http://localhost:3001/analyze", { url });
    lighthouseRes = response.data;
    console.log("✅ Lighthouse completed");
  } catch (error) {
    console.error("❌ Lighthouse failed:", error.message);
    lighthouseRes = { error: true, message: `Lighthouse failed: ${error.message}` };
  }

  // 🔹 Puppeteer
  try {
    console.log("⚡ Calling Puppeteer...");
    const response = await axios.post("http://localhost:3001/puppeteer", { url });
    puppeteerRes = response.data;
    console.log("✅ Puppeteer completed");
  } catch (error) {
    console.error("❌ Puppeteer failed:", error.message);
    puppeteerRes = { error: true, message: `Puppeteer failed: ${error.message}` };
  }

  // 🔹 Axe
  try {
    console.log("⚡ Calling Axe...");
    const response = await axios.post("http://localhost:3001/axe", { url });
    axeRes = response.data;
    console.log("✅ Axe completed");
  } catch (error) {
    console.error("❌ Axe failed:", error.message);
    axeRes = { error: true, message: `Axe failed: ${error.message}` };
  }

  // 🔹 Combined response (never breaks even if one fails)
  res.json({
    url,
    lighthouse: lighthouseRes,
    puppeteer: puppeteerRes,
    axe: axeRes,
  });
});

export default router;
