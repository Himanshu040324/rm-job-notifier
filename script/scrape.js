const { chromium } = require("playwright");

async function scrapeJobs(page) {
  // Wait until job cards are visible
  await page.waitForSelector("div.min-h-\\[270px\\]");

  const jobs = await page
    .locator("div.min-h-\\[270px\\]")
    .evaluateAll((cards) => {
      return cards.map((card) => {
        const title = card
          .querySelector(".tracking-tight")
          ?.textContent?.trim();

        const company = card
          .querySelector(".text-muted-foreground span")
          ?.textContent?.trim();

        const location = card
          .querySelector("svg.lucide-map-pin")
          ?.parentElement?.textContent?.trim();

        const type = card
          .querySelector("svg.lucide-briefcase")
          ?.parentElement?.textContent?.trim();

        const badges = [...card.querySelectorAll(".rounded-md")].map((e) =>
          e.textContent.trim(),
        );

        const salary = badges.find((text) => text.includes("₹"));

        const ctc = badges.find((text) => text.includes("LPA"));

        const applicationWindow = card
          .querySelector(".lucide-hourglass")
          ?.parentElement?.textContent?.trim();

        const status = card
          .querySelector(".border-red-300, .border-green-300")
          ?.textContent?.trim();

        return {
          // Used later for duplicate detection
          id: `${company}-${title}`.toLowerCase().replace(/\s+/g, "-"),

          title: title || "N/A",

          company: company || "N/A",

          location: location || "N/A",

          type: type || "N/A",

          salary: salary || "N/A",

          ctc: ctc || "N/A",

          applicationWindow: applicationWindow || "N/A",

          status: status || "N/A",

          scrapedAt: new Date().toISOString(),
        };
      });
    });

  return jobs;
}

module.exports = scrapeJobs;
