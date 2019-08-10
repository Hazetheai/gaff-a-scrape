const { Transform } = require("stream");
const fs = require("fs");
const JSONStream = require("JSONStream");
const parser = JSONStream.parse("*");

class FilterKeywords extends Transform {
  /**
   *
   * @param {string} keyword The word to search for
   * @param {string} heading The heading to query
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
    const re = new RegExp(this.keyword, "gi");
    if (this.keyword.length === 0) return;
    let filterChunk = Object.values(chunk).filter(el => {
      if (!this.heading) {
        return JSON.stringify(el.post).match(re);
      } else if (el.post[this.heading]) {
        return el.post.postTitle.match(re);
      } else return false;
    });
    this.push(JSON.stringify(filterChunk));
  }

  // _flush(callback) {
  //   this.push("");
  //   callback();
  // }
}

function getSearchResults() {
  let inp = fs.createReadStream(__dirname + `/data/db/db.json`, "utf-8");

  let out = fs.createWriteStream(
    __dirname + `/data/search_results/search-results.json`
  );

  inp
    .pipe(parser)
    .pipe(mySearch)
    .pipe(out);
  console.log("searched");
}

let mySearch = new FilterKeywords("MUTEK", "");
getSearchResults();

module.exports = getSearchResults;
