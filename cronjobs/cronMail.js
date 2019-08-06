const cron = require("node-cron");
const { sendEmail } = require("../email");

cron.schedule("0 */4 * * *", () => {
  sendEmail();
  console.log("Mailing");
});
