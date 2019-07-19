let postHeaderClass = "div._l53";
let postClass = "._1dwg";

function scrapeFbGroupPostTitles(classOrId) {
  let titleArr = Array.from(document.querySelectorAll(classOrId));
  return titleArr.map(el => el.textContent);
}

function scrapeFbGroupPostsWithPrices(classOrId) {
  let postsArr = Array.from(document.querySelectorAll(classOrId)).map(
    el => el.innerText
  );

  console.log("postsArr", postsArr);

  return postsArr
    .map(el => el.split("\n").filter(item => item.length > 0))
    .map(elem => {
      return {
        poster: elem[0],
        timeElapsed: elem[1],
        postTitle: elem[2],
        price: elem[3],
        location: elem[4],
        text: elem.slice(4)
      };
    });
}

module.exports = { scrapeFbGroupPostTitles, scrapeFbGroupPostsWithPrices };

// Scrolll page
// Add objects to json file
// use d3 to display data?
