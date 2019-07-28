const fs = require("fs");
// const selectedPage = require(`${desiredPage}.json`);

/**
 *
 * @param {string} fullDump Name of full pdf document you are parsing
 * @param {string} desiredPage Name of the file that will contain json for your desired page
 */
function getDesiredPage(fullDump, desiredPage) {
  const inputPages = fs.createReadStream(
    __dirname + `/json/raw/${fullDump}.json`,
    "utf-8"
  );
  const outputPage = fs.createWriteStream(
    __dirname + `/json/trimmed/${desiredPage}.json`
  );

  inputPages.on("data", chunk => {
    outputPage.write(
      JSON.stringify(JSON.parse(chunk).formImage.Pages[1].Texts)
    );
  });
  console.log(desiredPage);
  return desiredPage;
}

/**
 *
 * @param {Array} selectedPage Array of values to strip cc vals & names from
 */

function getCCValues(selectedPage) {
  for (i = 0; i < selectedPage.length; i++) {
    console.log(selectedPage[i].R[0].T);
  }
}

// getDesiredPage("se-02", "page1");

function getCCValues(page) {
  const desiredPage = require(__dirname + `/json/trimmed/${page}.json`);
  for (i = 0; i < desiredPage.length; i++) {
    desiredPage[i].R[0].T.replace(/%/, " ");
    console.log(JSON.stringify(desiredPage[i].R[0].T.replace(/%20|%/gi, " ")));
  }
}

getCCValues("page1");
