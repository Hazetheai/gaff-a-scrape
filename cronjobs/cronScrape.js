const { scrapeGroups } = require("../pupScrapeV2");
const { groups } = require("../groupsToScrape");
const cron = require("node-cron");

module.exports = cron.schedule("*/5 * * * *", () => {
  scrapeGroups(groups);
  console.log("Scraping");
});
