const { Transform } = require("stream");
const fs = require("fs");

class FilterKeywords extends Transform {
  /**
   *
   * @param {string} keyword The word to search for
   * @param {string} heading The heading to search
   */
  constructor(keyword = "", heading = "") {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    });
    this.heading = heading;
    this.keyword = keyword;
  }

  _transform(chunk, encoding, next) {
    if (this.keyword.length === 0) return;

    const filterChunk = JSON.parse(chunk).filter(el => {
      const re = new RegExp(this.keyword, "gi");
      if (!this.heading) {
        // No heading provided -> search everything
        return JSON.stringify(el).match(re);
      } else if (el[this.heading]) {
        return el[this.heading].match(re);
      } else return false;
    });
    this.push(JSON.stringify(filterChunk));
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
// getSearchResults("mtl-apts");
// getSearchResults("logements-a-louer-montreal");

module.exports = getSearchResults;
