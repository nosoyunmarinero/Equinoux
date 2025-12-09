import express from "express";
// 👇 Importa las funciones directamente en lugar de routers HTTP
import { runAnalysis } from "./analyze.js";
import { runPuppeteer } from "./puppeteer.js";
import { runAxe } from "./axe.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "You must provide a URL in the request body" });
  }

  console.log("🔍 Starting full analysis of:", url);

  let lighthouseRes, puppeteerRes, axeRes;

  // 🔹 Lighthouse
  try {
    console.log("⚡ Running Lighthouse...");
    lighthouseRes = await runAnalysis(url);
    console.log("✅ Lighthouse completed");
  } catch (error) {
    console.error("❌ Lighthouse failed:", error.message);
    lighthouseRes = { error: true, message: `Lighthouse failed: ${error.message}` };
  }

  // 🔹 Puppeteer
  try {
    console.log("🎭 Running Puppeteer...");
    puppeteerRes = await runPuppeteer(url);
    console.log("✅ Puppeteer completed");
  } catch (error) {
    console.error("❌ Puppeteer failed:", error.message);
    puppeteerRes = { error: true, message: `Puppeteer failed: ${error.message}` };
  }

  // 🔹 Axe
  try {
    console.log("♿ Running Axe...");
    axeRes = await runAxe(url);
    console.log("✅ Axe completed");
  } catch (error) {
    console.error("❌ Axe failed:", error.message);
    axeRes = { error: true, message: `Axe failed: ${error.message}` };
  }

  // 🔹 Combined response
  res.json({
    url,
    lighthouse: lighthouseRes,
    puppeteer: puppeteerRes,
    axe: axeRes,
  });
});

export default router;
