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
  return [...args].forEach(el => {
    let data = JSON.parse(
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
    // console.log("fiiiiillelele", data[0].poster);
    setTimeout(() => console.log("waiting"), 200);
    return data.map(
      el => `
    <ul class="list">
      <li>poster : ${el.poster}</li>
      <li>groupName : ${el.groupName}</li>
      <li>timeElapsed: ${el.timeElapsed}</li>
      <li>postTitle: ${el.postTitle}</li>
      <li>price : ${el.price}</li>
      <li>location : ${el.location}</li>
      <li>url : ${el.url}</li>
      <li>index : ${el.index}</li>
      <li>scrapedTimestamp : ${el.scrapedTimestamp}</li>
      <li>postedTimestamp : ${el.postedTimestamp}</li>
      <li>text : ${el.postedTimestamp}</li> 
    </ul>
    `
    );
  });
}

console.log("pretty", printJson(["mtl-apts"]));

const mailOptions = {
  from: emailLogin,
  to: "j.riordan@live.ie",
  subject: "🌻 Scraped Gaffs! 🌻",
  html: `


  ${printJson(["mtl-apts"])}

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
