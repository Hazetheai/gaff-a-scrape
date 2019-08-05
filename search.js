const { Transform } = require("stream");
const fs = require("fs");

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
// getSearchResults("logements-a-louer-montreal");
// module.exports = { getSearchResults };

const cron = require("node-cron");

cron.schedule("* */4 * * *", () => {
  console.log("Searching");
  getSearchResults("logements-a-louer-montreal");
});

/**
 * class FilterKeywords extends Transform {
  /**
   *
   * @param {string} poster
   * @param {string} timeElapsed
   * @param {string} postTitle
   * @param {string} price
   * @param {string} location
   * @param {string} text
   */

/*
  constructor(
    poster = "",
    timeElapsed = "",
    postTitle = "",
    price = "",
    location = "",
    text = ""
  ) {
    super();
    this.poster = poster;
    this.timeElapsed = timeElapsed;
    this.postTitle = postTitle;
    this.price = price;
    this.location = location;
    this.text = text;
  }

  _transform(chunk, encoding, callback) {
    const filterChunk = JSON.stringify(
      JSON.parse(chunk).filter(el => {
        const poster = new RegExp(this.location, "gi");
        const timeEl = new RegExp(this.location, "gi");
        const title = new RegExp(this.location, "gi");
        const loc = new RegExp(this.location, "gi");
        const txt = new RegExp(this.location, "gi");

        if (el.poster.length > 0) {
          return el.poster.match(poster);
        }
        if (el.timeElapsed.length > 0) {
          return el.timeEl.match(timeEl);
        }
        if (el.postTitle.length > 0) {
          return el.title.match(title);
        }
        if (el.location.length > 0) {
          return el.location.match(loc);
        }
        if (el.text.length > 0) {
          return el.location.match(txt);
        }
      })
    );
    this.push(filterChunk);
  }

  _flush(callback) {
    this.push("");
    callback();
  }
}
 */
