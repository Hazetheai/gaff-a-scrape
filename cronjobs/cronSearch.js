const getSearchResults = require("../search");
const cron = require("node-cron");

module.exports = cron.schedule("*/10 * * * *", () => {
  getSearchResults("logements-a-louer-montreal");
  console.log("Searching");
});
