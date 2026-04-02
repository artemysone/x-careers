import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { resolve } from "path";

const OUTPUT_DIR = resolve("public/demo");
mkdirSync(OUTPUT_DIR, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--window-size=1920,1080"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 10000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. For You - top
  await page.screenshot({ path: `${OUTPUT_DIR}/01-foryou-top.png` });
  console.log("1 ✓");

  // 2. For You - scrolled
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUTPUT_DIR}/02-foryou-mid.png` });
  console.log("2 ✓");

  // 3. For You - Grok
  await page.evaluate(() => window.scrollTo(0, 950));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUTPUT_DIR}/03-foryou-grok.png` });
  console.log("3 ✓");

  // 4. Explore
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const btns = Array.from(document.querySelectorAll("button"));
    const btn = btns.find((b) => b.textContent?.trim() === "Explore");
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUTPUT_DIR}/04-explore.png` });
  console.log("4 ✓");

  // 5. Explore scrolled
  await page.evaluate(() => window.scrollTo(0, 450));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUTPUT_DIR}/05-explore-scroll.png` });
  console.log("5 ✓");

  // 6. Watchlist
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const btns = Array.from(document.querySelectorAll("button"));
    const btn = btns.find((b) => b.textContent?.trim() === "Watchlist");
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUTPUT_DIR}/06-watchlist.png` });
  console.log("6 ✓");

  // 7. Watchlist scrolled
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUTPUT_DIR}/07-watchlist-scroll.png` });
  console.log("7 ✓");

  // 8. Open chat modal by clicking the chat bubble button in actions
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    // Find buttons with the rounded-[12px] class that contain an SVG (the chat buttons)
    const allButtons = Array.from(document.querySelectorAll("button"));
    const chatBtns = allButtons.filter((b) => {
      const cls = b.getAttribute("class") || "";
      return cls.includes("rounded-") && cls.includes("border-x-border") && b.querySelector("svg path[d*='11.5']");
    });
    if (chatBtns.length > 0) chatBtns[0].click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUTPUT_DIR}/08-chat-open.png` });
  console.log("8 ✓");

  // 9. Click xAI Recruiting in chat
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll("div"));
    for (const div of divs) {
      if (div.textContent?.includes("xAI Recruiting") && div.textContent?.includes("2d") && div.className?.includes("cursor-pointer")) {
        div.click();
        break;
      }
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUTPUT_DIR}/09-chat-convo.png` });
  console.log("9 ✓");

  // 10. Scroll chat to bottom
  await page.evaluate(() => {
    const scrollables = Array.from(document.querySelectorAll(".overflow-y-auto"));
    const chatScroll = scrollables[scrollables.length - 1];
    if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUTPUT_DIR}/10-chat-scroll.png` });
  console.log("10 ✓");

  await browser.close();
  console.log("\nDone!");
}

run().catch((e) => { console.error(e); process.exit(1); });
