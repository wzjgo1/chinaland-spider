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

let page;
const init = async () => {
  const browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
};

const main = async skipNum => {
  dbc = db.db("landchina");
  const originData = await dbc
    .collection("land")
    .find()
    .skip(skipNum)
    .limit(1)
    .toArray();
  if (originData.length < 1) {
    return;
  }

  let realData = originData[0];
  const url = realData.detailHref;
  await page.goto(url, { waitUntil: "load", timeout: 0 });
  await page.waitForSelector(
    "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1"
  );

  let location,
    electronicSupervisionNumber,
    projectName,
    projectLocation,
    landArea,
    landSource,
    landUsage,
    landSupplyMethod,
    useYear,
    category,
    landLevel,
    dealPrice,
    paymentPeriodNumber,
    appointedPaymentDate,
    agreedPaymentAmount,
    remarks,
    landUser,
    lowerVolumeRate,
    upperVolumeRate,
    landingTime,
    startTime,
    endTime,
    realStartTime,
    realEndTime,
    approvedUnit,
    contractSignTime;
  try {
    location = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r1_c2_ctrl",
      el => el.innerText
    );
    electronicSupervisionNumber = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r1_c4_ctrl",
      el => el.innerText
    );
    projectName = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r17_c2_ctrl",
      el => el.innerText
    );
    projectLocation = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r16_c2_ctrl",
      el => el.innerText
    );
    landArea = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r2_c2_ctrl",
      el => el.innerText
    );
    landSource = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r2_c4_ctrl",
      el => el.innerText
    );
    landUsage = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r3_c2_ctrl",
      el => el.innerText
    );
    landSupplyMethod = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r3_c4_ctrl",
      el => el.innerText
    );
    useYear = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r19_c2_ctrl",
      el => el.innerText
    );
    category = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r19_c4_ctrl",
      el => el.innerText
    );
    landLevel = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r20_c2_ctrl",
      el => el.innerText
    );
    dealPrice = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r20_c4_ctrl",
      el => el.innerText
    );
    paymentPeriodNumber = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f3_r2_c1_0_ctrl",
      el => el.innerText
    );
    appointedPaymentDate = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f3_r2_c2_0_ctrl",
      el => el.innerText
    );
    agreedPaymentAmount = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f3_r2_c3_0_ctrl",
      el => el.innerText
    );
    remarks = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f3_r2_c4_0_ctrl",
      el => el.innerText
    );
    landUser = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r9_c2_ctrl",
      el => el.innerText
    );
    lowerVolumeRate = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f2_r1_c2_ctrl",
      el => el.innerText
    );
    upperVolumeRate = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f2_r1_c4_ctrl",
      el => el.innerText
    );
    landingTime = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r21_c4_ctrl",
      el => el.innerText
    );
    startTime = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r22_c2_ctrl",
      el => el.innerText
    );
    endTime = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r22_c4_ctrl",
      el => el.innerText
    );
    realStartTime = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r10_c2_ctrl",
      el => el.innerText
    );
    realEndTime = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r10_c4_ctrl",
      el => el.innerText
    );
    approvedUnit = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r14_c2_ctrl",
      el => el.innerText
    );
    contractSignTime = await page.$eval(
      "#mainModuleContainer_1855_1856_ctl00_ctl00_p1_f1_r14_c4_ctrl",
      el => el.innerText
    );
  } catch (err) {
    //
  } finally {
    const updateStr = {
      $set: {
        location,
        electronicSupervisionNumber,
        projectName,
        projectLocation,
        landArea,
        landSource,
        landUsage,
        landSupplyMethod,
        useYear,
        category,
        landLevel,
        dealPrice,
        paymentPeriodNumber,
        appointedPaymentDate,
        agreedPaymentAmount,
        remarks,
        landUser,
        lowerVolumeRate,
        upperVolumeRate,
        landingTime,
        startTime,
        endTime,
        realStartTime,
        realEndTime,
        approvedUnit,
        contractSignTime
      }
    };
    await dbc
      .collection("land")
      .updateOne({ _id: realData._id }, updateStr, function(err) {
        if (err) throw err;
      });
  }
};

const go = async () => {
  await init();
  let skipNum = 0;
  while (true) {
    await main(skipNum);
    skipNum++;
  }
};

go();
