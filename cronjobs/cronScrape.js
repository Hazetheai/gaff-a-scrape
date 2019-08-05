const { scrapeGroups } = require("../pupScrapeV2");
const { groups } = require("../groupsToScrape");
const getSearchResults = require("../search.js");
const cron = require("node-cron");

cron.schedule("0 */3 * * *", () => {
  scrapeGroups(groups);
  console.log("Scraping");
});
