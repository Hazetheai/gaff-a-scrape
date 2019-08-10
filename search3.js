const { Transform } = require("stream");
const fs = require("fs");
const JSONStream = require("JSONStream");
const parser = JSONStream.parse("*");
const stringer = JSONStream.stringify("*");

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

    console.log(
      "agdhab",
      Object.values(chunk).filter(el => {
        if (el.post.poster == this.keyword) {
          return el.post;
        }
      })
    );

    if (this.keyword.length === 0) return;
    let filterChunk = Object.values(chunk).filter(el =>
      el.post.poster.match(re)
    );
    this.push(JSON.stringify(filterChunk));
  }

  // _flush(callback) {
  //   this.push("");
  //   callback();
  // }
}

/**
 *
 * @param {string} args Database Name
 */

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

let mySearch = new FilterKeywords("Flo Ressouche", "postTitle");
getSearchResults();
