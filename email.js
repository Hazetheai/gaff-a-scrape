const nodemailer = require("nodemailer");
const { emailLogin, emailPassword } = require("./config/keys");
const fs = require("fs");
const cron = require("node-cron");

const timezone = "en-US";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailLogin,
    pass: emailPassword
  }
});

function getLocalTime(timezone, timestamp) {
  const date = new Date(timestamp).toLocaleDateString(timezone);
  const time = new Date(timestamp).toLocaleTimeString(timezone);
  return `${date} at ${time}`;
}

function printJson() {
  const file = JSON.parse(
    fs.readFileSync(
      `${__dirname}/data/search_results/search-results.json`,
      "utf8",
      (err, data) => {
        if (err) throw err;
        else {
          return data;
        }
      }
    )
  );

  /**
   *
   * @param {string} timezone Local timezone
   * @param {number} timestamp unix timestamp
   */

  // console.log("file", file);

  return file
    .sort((a, b) => b.id - a.id)
    .slice(0, 14)
    .map(el => {
      if (el.post == undefined) return "No Post Info";

      return `
    <ul class="list">
    <li>Poster : ${el.post.poster || el.post.index}</li>
    
    <li>Group Name : ${el.post.groupName || el.post.index}</li>
        
    <li>Post Title: ${el.post.postTitle || el.post.index}</li>
    
    <li>Price : ${el.post.price || ""}</li>
    
    <li>Location : ${el.post.location || ""}</li>
    
    <li>URL : ${el.post.url}</li>
        
    <li>Scraped at : ${getLocalTime(timezone, el.post.scrapedTimestamp) ||
      el.post.index}</li>
    
    <li>Posted at : ${getLocalTime(timezone, el.post.postedTimestamp) ||
      el.post.index}</li>
    
    <li>Additional Text : ${el.post.text ? el.post.text : "No extra info"}</li>
    
    </ul>
    `;
    });
}
console.log("printJson", printJson());
const mailOptions = {
  from: emailLogin,
  to: "j.riordan@live.ie",
  subject: "🌻 Scraped Gaffs! 🌻",
  html: `

  ${printJson()}

    <p>–Your friends at Gaff-a-Scrape</p>
      `
};

const sendEmail = () => {
  transporter.sendMail(mailOptions, err => {
    if (err) {
      console.error("Error sending email %%@$@£", err);
    }
    console.log(`** Email Sent **`);
  });
};

cron.schedule("20 * * * *", () => {
  console.log("Composing Email");
  sendEmail();

  console.log("Done!");
});
