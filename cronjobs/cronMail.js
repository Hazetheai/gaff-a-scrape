const cron = require("node-cron");
const { sendEmail } = require("../email");

module.exports = cron.schedule("*/15 * * * *", () => {
  sendEmail();
  console.log("Mailing");
});
