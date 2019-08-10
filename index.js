const getSearchResults = require("./search");
const { scrapeGroups } = require("./pupScrapeV2");
const { groups } = require("./groupsToScrape");
const cron = require("node-cron");

getSearchResults(["mtl-apts"]);
