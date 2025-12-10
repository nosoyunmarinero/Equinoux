import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

// 🔹 Función reutilizable
export async function runPuppeteer(url) {
  if (!url) throw new Error("You must provide a URL");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process", // Ayuda en entornos con recursos limitados
        "--no-zygote"
      ],
    });
    const page = await browser.newPage();

    const start = Date.now();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const end = Date.now();

    const loadTime = end - start;
    const title = await page.title();

    return {
      url,
      title,
      loadTime: `${loadTime} ms`,
    };
  } finally {
    // 🔹 CRÍTICO: Siempre cerrar el browser
    if (browser) {
      await browser.close();
    }
  }
}

// 🔹 Router HTTP
router.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    const result = await runPuppeteer(url);
    res.json(result);
  } catch (error) {
    let userMessage = "Could not analyze the page with Puppeteer :(";
    if (error.message.includes("timeout")) {
      userMessage = "The page took too long to load and the analysis was canceled ):";
    } else if (error.message.includes("500")) {
      userMessage = "The page server returned an internal error (500) :(";
    } else if (error.message.includes("net::ERR_CONNECTION_RESET")) {
      userMessage = "The connection to the page was interrupted :c";
    }

    res.json({
      url,
      error: true,
      message: `Puppeteer failed: ${error.message}`,
      userMessage,
      title: null,
      loadTime: null,
    });
  }
});

export default router;