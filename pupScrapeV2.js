const puppeteer = require("puppeteer");
const fs = require("fs");

//          ------ Info I want to be able to pass as a User------
//  ==> Input Parameters
// groups               => Array of objects             => Default to null   required          => {name:"", url: ""}
// Number of posts      => Number                       => Default to 100

//  ==> Query parameters
// Location         => Array of strings             => Default to null
// Price            => Number (Value in between)    => default to null
// Size             => Array (String & number)      => default to null

// Dev params
const postClass = "._1dwg";
const groupTitle = "#seo_h1_tag";
const groupTitleOnMobile = "._de1";

// User Modifiable params
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
const numberOfPosts = 100;

/**
 *
 * @param {string} postClassOrId
 */

// Takes post class or id and returns array of objects with predefined Keys
function scrapeFbGroupPostsWithPrices(postClassOrId = "._1dwg") {
  const posts = Array.from(document.querySelectorAll(postClassOrId));
  const postsArr = posts.map(el => el.innerText);
  return postsArr
    .map(el => el.split("\n").filter(item => item.length > 0))
    .map(elem => {
      return {
        scrapedTimestamp: Date.now(),
        // postedTimestamp: posts[x].querySelector('[data-shorten="1"]').dataset.utime,
        groupName: posts[0].ownerDocument.title,
        poster: elem[0],
        timeElapsed: elem[1],
        postTitle: elem[2],
        price: elem[3],
        location: elem[4],
        text: elem.slice(4).reduce((acc, currVal) => {
          return acc.concat(currVal);
        }, [])
      };
    });
}

/**
 *
 * @param {string} titleClassOrId
 * @param {() => void} page

 */

async function getGroupTitle(page, titleClassOrId = "#seo_h1_tag") {
  return page.evaluate(() =>
    document
      .querySelector("#seo_h1_tag")
      .innerText.replace(/,\s|\s/gi, "-")
      .toLowerCase()
  );
}

/**
 *
 * @param {() => void} page
 * @param {function} scrapeFunc
 * @param {number} itemTargetCount
 * @param {number} scrollDelay
 *
 */
// Scrapes an infinite scroll page for a user specified number of posts at a predefined delay(So that pages loads content)
async function scrapeInfiniteScroll(
  page,
  scrapeFunc = scrapeFbGroupPostsWithPrices,
  itemTargetCount = 100,
  scrollDelay = 1000
) {
  let items = [];

  try {
    let previousHeight;

    while (items.length < itemTargetCount) {
      items = await page.evaluate(scrapeFunc);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
    }
  } catch (e) {
    console.log("error", e);
  }
  return items;
}

/**
 *
 * @param {{name: string, url: string}} target
 * @param {string} [target.name]
 * @param {string} target.url
 */

async function executeScript(target) {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 980 });

  await page.goto(target.url);

  //   Clean namestrings and make into kebab-case
  const scrapedTitle = await getGroupTitle(page, groupTitle);
  // console.log("scrapedTitle", scrapedTitle);

  if (target.name.length === 0) {
    target.name = scrapedTitle;
    if (scrapedTitle === undefined)
      target.name = target.url.substring(12).replace(/\/|.com/gi, "-");
  } else target.name.replace(/,\s|\s/gi, "-").toLowerCase();

  // console.log("target.name", target.name);
  const items = await scrapeInfiniteScroll(
    page,
    scrapeFbGroupPostsWithPrices,
    numberOfPosts
  );

  fs.writeFileSync(
    `./data/${target.name}.json`,
    JSON.stringify(items),
    "utf-8"
  );

  console.log("result", items.length);
  await browser.close();
}

/**
 *
 * @param {Array.<Object>} groups
 */

const scrapeGroups = async groups => {
  for (target of groups) {
    await executeScript(target);
  }
};
// scrapeGroups(groups);

module.exports = { scrapeGroups };
