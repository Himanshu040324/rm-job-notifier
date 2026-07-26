require("dotenv").config({
  quiet: true,
});

const fs = require("fs");
const login = require("./login");
const sendTelegramMessage = require("./notifier");
const { chromium } = require("playwright");
const scrapeJobs = require("./scrape");
const compareJobs = require("./compare");

(async () => {
  // Ensure session exists
  if (!fs.existsSync("storageState.json")) {
    console.log("No session found. Logging in...");
    await login();
  }

  let browser = await chromium.launch({ headless: true });
  let context = await browser.newContext({ storageState: "storageState.json" });
  let page = await context.newPage();

  await page.goto("https://rm.dcedtu.in/jobs");

  // Handle expired session seamlessly
  if (page.url().includes("/login")) {
    console.log("Session expired. Re-authenticating...");
    await browser.close();

    await login();

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ storageState: "storageState.json" });
    page = await context.newPage();
    await page.goto("https://rm.dcedtu.in/jobs");
  }

  const jobs = await scrapeJobs(page);
  const newJobs = compareJobs(jobs);

  if (newJobs && newJobs.length > 0) {
    console.log(`${newJobs.length} new job(s) found!`);
    await sendTelegramMessage(newJobs);
  } else {
    console.log("No new jobs found.");
  }

  await browser.close();
})();