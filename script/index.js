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
  // If session does not exist, create it
  if (!fs.existsSync("storageState.json")) {
    console.log("No session found. Logging in...");

    await login();
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    storageState: "storageState.json",
  });

  const page = await context.newPage();

  await page.goto("https://rm.dcedtu.in/jobs");

  // Check if session expired
  if (page.url().includes("/login")) {
    console.log("Session expired. Logging in again...");

    await browser.close();

    await login();

    return;
  }

  const jobs = await scrapeJobs(page);

  const newJobs = compareJobs(jobs);

  if (newJobs.length > 0) {
    console.log(`${newJobs.length} new job(s) found\n`);

    console.log(JSON.stringify(newJobs, null, 2));

    await sendTelegramMessage(newJobs);
  } else {
    console.log("No new jobs");
  }

  await browser.close();
})();
