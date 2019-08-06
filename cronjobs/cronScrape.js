const { scrapeGroups } = require("../pupScrapeV2");
const { groups } = require("../groupsToScrape");
const getSearchResults = require("../search");
const cron = require("node-cron");

cron.schedule("21 * * * *", () => {
  scrapeGroups(groups)
    .then(setTimeout(() => getSearchResults("mtl-apts"), 300000))
    .catch(err => console.error("Scrape Cron Error", err));
  console.log("Scraping");
});
