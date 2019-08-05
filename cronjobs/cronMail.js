const cron = require("node-cron");
const { sendEmail } = require("../email");

cron.schedule("* */4 * * *", () => {
  sendEmail();
  console.log("Mailing");
});
