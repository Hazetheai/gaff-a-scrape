const { scrapeGroups } = require("./pupScrapeV2");
const { Transform } = require("stream");
const fs = require("fs");

const groups = [
  {
    name: "logements-a-louer-montreal",
    url: "https://www.facebook.com/groups/543228419200362"
  },
  {
    name: "",
    url: "https://www.facebook.com/groups/335425193549035"
  }
];

class FilterKeywords extends Transform {
  //   constructor(poster, timeElapsed, postTitle, price, location, text) {
  constructor(location) {
    super();
    // this.poster = poster;
    // this.timeElapsed = timeElapsed
    // this.postTitle = postTitle
    // this.price = price
    this.location = location;
    // this.text = text
  }

  _transform(chunk, encoding, callback) {
    const filterChunk = JSON.stringify(
      JSON.parse(chunk).filter(el => {
        const re = new RegExp(this.location, "gi");
        if (el.location) {
          return el.location.match(re);
        } else return false;
      })
    );
    this.push(filterChunk);
    callback();
  }

  _flush(callback) {
    this.push("");
    callback();
  }
}
/**
 *
 * @param {string} inputFile input Filename
 * @param {string} outputFile output Filename
 */

function getSearchResults(inputFile, outputFile = inputFile) {
  const inp = fs.createReadStream(
    __dirname + `/data/${inputFile}.json`,
    "utf-8"
  );
  const out = fs.createWriteStream(
    __dirname + `/data/search_results/${outputFile}.json`
  );

  inp.pipe(mySearch).pipe(out);
  console.log("searched");
}

let mySearch = new FilterKeywords("plateau");

// (async () => {
//   scrapeGroups(groups).then(done => {
//     if (done) console.log("promise done");
//   });

//   await getSearchResults("logements-a-louer-montreal");
//   console.log("Donezo");
// })();

scrapeGroups(groups).then(() => getSearchResults("logements-a-louer-montreal"));
