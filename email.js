const nodemailer = require("nodemailer");
const { emailLogin, emailPassword } = require("./config/keys");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailLogin,
    pass: emailPassword
  }
});

/**
 *
 * @param {String[]} args Files to be included in email
 */
function printJson(args) {
  let filesArr = [...args].map(el => {
    return JSON.parse(
      fs.readFileSync(
        `${__dirname}/data/search_results/${el}.json`,
        "utf8",
        (err, data) => {
          if (err) throw err;
          else {
            return data;
          }
        }
      )
    );
  });
  return filesArr.map(elem => {
    return elem.map(el => {
      if (el == undefined) return "No Post Info";

      return `
    <ul class="list">
    <li>poster : ${el.poster || el.index}</li>
    
    <li>groupName : ${el.groupName || el.index}</li>
    
    <li>timeElapsed: ${el.timeElapsed || el.index}</li>
    
    <li>postTitle: ${el.postTitle || el.index}</li>
    
    <li>price : ${el.price || el.index}</li>
    
    <li>location : ${el.location || el.index}</li>
    
    <li>url : ${el.url || el.index}</li>
    
    <li>index : ${el.index}</li>
    
    <li>scrapedTimestamp : ${el.scrapedTimestamp || el.index}</li>
    
    <li>postedTimestamp : ${el.postedTimestamp || el.index}</li>
    
    <li>text : ${el.postedTimestamp || el.index}</li>
    
    </ul>
    `;
    });
  });
}

const mailOptions = {
  from: emailLogin,
  to: "j.riordan@live.ie",
  subject: "🌻 Scraped Gaffs! 🌻",
  html: `

  ${printJson(["mtl-apts", "logements-a-louer-montreal"])}

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

// sendEmail();

module.exports = {
  sendEmail
};
