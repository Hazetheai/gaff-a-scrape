const { Transform } = require("stream");
const fs = require("fs");
const { groups } = require("./groupsToScrape");

class FilterKeywords extends Transform {
  //   constructor(poster, timeElapsed, postTitle, price, location, text) {

  /**
   *
   * @param {string} location the location you want to filter by
   */
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

  // _flush(callback) {
  //   this.push("");
  //   callback();
  // }
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

let mySearch = new FilterKeywords("e");

getSearchResults("logements-a-louer-montreal");
// getSearchResults("mtl-apts");

module.exports = getSearchResults;
