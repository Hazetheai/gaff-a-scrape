const { scrapeGroups } = require("../pupScrapeV2");
const { sendEmail } = require("../email");
const { groups } = require("../groupsToScrape");
const getSearchResults = require("../search");
const cron = require("node-cron");

cron.schedule("*/15 * * * *", () => {
  scrapeGroups(groups)
    .then(setTimeout(() => getSearchResults("mtl-apts"), 300000))
    .then(setTimeout(() => sendEmail(), 350000))
    .catch(err => console.error("Scrape Cron Error", err));
  console.log("Scraping");
});
