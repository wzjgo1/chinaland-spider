const puppeteer = require("puppeteer");
// const HtmlTableToJson = require("html-table-to-json")
const tabletojson = require("tabletojson");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter
var MongoClient = require("mongodb").MongoClient;

var dbUrl = "mongodb://localhost:27017";

let db;

MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, d) {
  if (err) throw err;
  db = d;
});

// const csvWriter = createCsvWriter({
//   path: "out.csv",
//   header: [
//     { id: "id", title: "序号" },
//     { id: "region", title: "行政区" },
//     { id: "location", title: "土地坐落" },
//     { id: "area", title: "总面积" },
//     { id: "use", title: "土地用途" },
//     { id: "way", title: "供应方式" },
//     { id: "date", title: "签定日期" }
//   ]
// })

const waitPageListDome = async page => {
  try {
    await page.waitForSelector("#TAB_contentTable");
  } catch (err) {
    console.log(err);
    await waitPageListDome(page);
  }
};

let page;
const init = async () => {
  const browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto(
    "https://www.landchina.com/default.aspx?tabid=263&ComName=default",
    { waitUntil: "load", timeout: 0 }
  );
  await page.waitForSelector("#TAB_QueryConditionItem270");
  const dateRangeDom = await page.$("#TAB_QueryConditionItem270");
  await dateRangeDom.click();
};

let lasterId = "";

const main = async () => {
  while (true) {
    await page.waitForSelector("#TAB_contentTable");
    // const pagerHtmls = await page.$$(".pager");
    // if (!pagerHtmls || pagerHtmls.length < 3) {
    //   return;
    // }

    // 执行计算
    const tableHtml = await page.$eval("#TAB_contentTable", e => e.outerHTML);
    let jsonTables = tabletojson.convert(tableHtml, {
      useFirstRowForHeadings: true
    })[0];
    jsonTables.shift();
    jsonTables = convert(jsonTables);

    const detailHrefList = await page.$$eval("#TAB_contentTable a", els =>
      Array.from(els).map(el => el.href)
    );
    if (detailHrefList.length === 0) {
      return;
    }

    for (let i = 0; i < detailHrefList.length; i++) {
      jsonTables[i].detailHref = detailHrefList[i];
    }

    if (jsonTables[0].id === lasterId) {
      lasterId = "";
      return;
    } else {
      lasterId = jsonTables[0].id;
    }

    // writeFile(jsonTables)
    await saveToDb(jsonTables);

    const pagerHtmls = await page.$$(".pager");
    if (!pagerHtmls || pagerHtmls.length < 3) {
      return;
    }

    const pageLinks = await page.$$(".pager a");
    if (!pageLinks) {
      return;
    }
    pageLinks.forEach(element => {
      page.evaluate(async e => {
        if (e.text === "下页") {
          await e.click();
        }
      }, element);
    });
  }
};

const saveToDb = async data => {
  dbc = db.db("landchina");
  await dbc.collection("land").insertMany(data, function(err, res) {
    if (err) {
      console.log("文档插入失败");
    }
  });
};

//     { id: "id", title: "序号" },
//     { id: "region", title: "行政区" },
//     { id: "location", title: "土地坐落" },
//     { id: "area", title: "总面积" },
//     { id: "use", title: "土地用途" },
//     { id: "way", title: "供应方式" },
//     { id: "date", title: "签定日期" }

const convert = data => {
  const newItems = data.map(item => {
    const newItem = {
      id: item["0"],
      region: item["1"],
      location: item["2"],
      area: item["3"],
      used: item["4"],
      way: item["5"],
      date: item["6"]
    };
    return newItem;
  });
  return newItems;
};

const run = async (start, end) => {
  await page.waitFor(1000);
  await page.focus("#TAB_queryDateItem_270_1");
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(start);
  await page.focus("#TAB_queryDateItem_270_2");
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(end);
  await page.waitFor(1000);
  await page.focus("#TAB_QueryButtonControl");
  await page.$eval("#TAB_QueryButtonControl", elem => elem.click());
  await main();
};

const go = async () => {
  await init();
  let start = "1995-10-1";
  let end = start;
  while (true) {
    await run(start, end);
    start = getDate(start);
    end = start;
  }
};

go();

const getDate = origin => {
  const originDate = new Date(origin);
  const currentDate = new Date(originDate.getTime() - 1000 * 3600 * 24);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  return `${year}-${month}-${day}`;
};
