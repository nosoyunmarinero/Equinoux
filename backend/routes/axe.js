import express from "express";
import puppeteer from "puppeteer";
import axeCore from "axe-core";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "You must provide a URL in the request body" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page.addScriptTag({ content: axeCore.source });

    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    await browser.close();

    res.json({
      url,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.map((n) => n.html),
      })),
    });
  } catch (error) {
    let userMessage = "Could not run the accessibility audit :(";
    if (error.message.includes("net::ERR_CONNECTION_RESET")) {
      userMessage = "The connection to the page was interrupted during the analysis :c";
    } else if (error.message.includes("timeout")) {
      userMessage = "The page took too long to respond and the analysis was canceled Dx";
    }

    res.json({
      url,
      error: true,
      message: `Axe failed: ${error.message}`,
      userMessage,
      violations: [],
    });
  }
});

export default router;
