const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/db/db.json");
const db = low(adapter);
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

// Get Filenames
const directoryPath = path.join(__dirname, "data/scraped");
const updateDB = () => {
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    printJson(files);
  });
};

// Pass contents to db Func
/**
 *
 * @param {String[]} args Files to be included in email
 */
function printJson(args) {
  let filesArr = [...args].map(el => {
    return JSON.parse(
      fs.readFileSync(
        `${__dirname}/data/scraped/${el}`,
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
  filesArr.forEach(el =>
    el.filter(elem => {
      if (
        db
          .get("posts")
          .find({ id: elem.postedTimestamp })
          .value()
      ) {
        return false;
      } else {
        db.get("posts")
          .push({ id: elem.postedTimestamp, post: elem })
          .write();
        db.update("count", n => n + 1).write();
      }
    })
  );
}

// Write to DB
db.defaults({ posts: [], user: {}, count: 0 }).write();

db.set("user.name", "jakeriordan").write();

// module.exports = updateDB;

// cron.schedule("15 3 * * *", () => {
//   console.log("Populating DB");
updateDB();

//   console.log("Populated DB");
// });
