require("dotenv").config({
  quiet: true,
});

const { chromium } = require("playwright");

async function login() {
  if (!process.env.RM_USERNAME || !process.env.RM_PASSWORD) {
    throw new Error("❌ Missing RM credentials in .env");
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("https://rm.dcedtu.in/login");

  console.log("Logging in...");

  await page.fill('input[name="email"]', process.env.RM_USERNAME);

  await page.fill('input[name="password"]', process.env.RM_PASSWORD);

  await page.click('button[type="submit"]');

  await page.waitForTimeout(3000);

  const currentURL = page.url();

  console.log("Current URL:", currentURL);

  if (currentURL.includes("/login")) {
    await browser.close();

    throw new Error("❌ Login failed. Check username/password.");
  }

  await context.storageState({
    path: "storageState.json",
  });

  console.log("✅ Login successful! Session saved.");

  await browser.close();
}

module.exports = login;
