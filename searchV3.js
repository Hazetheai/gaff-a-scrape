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
    if (this.keyword.length === 0) return;

    // console.log(
    //   "agdhab",
    //   Object.values(chunk).filter(el => {
    //     if (el.post.poster == this.keyword) {
    //       return el.post;
    //     }
    //   })
    // );
    console.log("Object.values(chunk)", Object.values(chunk)[0].post.poster);
    let filterChunk = Object.values(chunk).filter(el => {
      if (!this.heading) {
        return JSON.stringify(el.post).match(re);
      } else if (el.post[this.heading]) {
        return el.post.postTitle.match(re);
      } else return false;
    });
    console.log("filterChunk", filterChunk);
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

let mySearch = new FilterKeywords("3 1/2", "");
getSearchResults();
