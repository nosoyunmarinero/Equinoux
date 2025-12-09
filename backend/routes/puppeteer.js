import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

// 🔹 Función reutilizable
export async function runPuppeteer(url) {
  if (!url) throw new Error("You must provide a URL");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const start = Date.now();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  const end = Date.now();

  const loadTime = end - start;
  const title = await page.title();

  await browser.close();

  return {
    url,
    title,
    loadTime: `${loadTime} ms`,
  };
}

// 🔹 Router HTTP (sigue funcionando igual)
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
