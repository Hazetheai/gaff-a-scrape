const nodemailer = require("nodemailer");
const { emailLogin, emailPassword } = require("./config/keys");
const fs = require("fs");

const timezone = "en-US";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailLogin,
    pass: emailPassword
  }
});

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
  function getLocalTime(timezone, timestamp) {
    const date = new Date(timestamp).toLocaleDateString(timezone);
    const time = new Date(timestamp).toLocaleTimeString(timezone);
    return `${date} at ${time}`;
  }

  // console.log("file", file);

  return file.map(el => {
    if (el.post == undefined) return "No Post Info";

    return `
    <ul class="list">
    <li>poster : ${el.post.poster || el.post.index}</li>
    
    <li>groupName : ${el.post.groupName || el.post.index}</li>
    
    <li>timeElapsed: ${el.post.timeElapsed || el.post.index}</li>
    
    <li>postTitle: ${el.post.postTitle || el.post.index}</li>
    
    <li>price : ${el.post.price || el.post.index}</li>
    
    <li>location : ${el.post.location || el.post.index}</li>
    
    <li>url : ${el.post.url || el.post.index}</li>
    
    <li>index : ${el.post.index}</li>
    
    <li>scrapedTimestamp : ${getLocalTime(timezone, el.post.scrapedTimestamp) ||
      el.post.index}</li>
    
    <li>postedTimestamp : ${getLocalTime(timezone, el.post.postedTimestamp) ||
      el.post.index}</li>
    
    <li>text : ${el.post.postedTimestamp || el.post.index}</li>
    
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

  ${printJson(["logements-a-louer-montreal", "mtl-apts"])}

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

sendEmail();

module.exports = {
  sendEmail
};
