var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();
var Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require("path");

function download(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri)
    .pipe(fs.createWriteStream(filename))
    .on("close", callback);
 });
}
/* GET users listing. */
router.post('/', function(req, res, next) {
  var betrow = (parseInt(req.body.betrow)+2);
  (async () => {
    const browser = await puppeteer.launch({headless: false,args: [
    '--window-size=1366,768',

  ],executablePath: 'C:\\chrome-win\\chrome.exe'});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto(req.body.beturl,{waitUntil: 'networkidle2',timeout: 30000000});
  
    await page.type('#loginName', req.body.username);
    await page.type('#password', req.body.password);
    //await page.waitFor('#placeBets');
    const el = await page.$('#authenticateImage');
    await el.screenshot({ path: 'capture.png'});


    var image = await fs.readFileSync(
      path.resolve(__dirname, "../capture.png"),
      {
        encoding: null
      }
    );

   await Tesseract.recognize(image)
      .progress(function(p) {
      //  console.log('progress', p);
      })
      .then(function(result) {
        page.type('#validCode', result.text);
      });

//     let imageLink = await page.evaluate(() => {
//       const image = document.querySelector('#authenticateImage');
//       return image.src;
//   })


//   download(imageLink, "image.png", function() {
//     console.log("Image downloaded");
//  });
  // console.log(imageLink);
  // var request = require('request').defaults({ encoding: null });
  // request.get(imageLink, function (err, res, body) {
  //   Tesseract.recognize(body)
  //   .progress(function(p) {
  //   //  console.log('progress', p);
  //   })
  //   .then(function(result) {
  //     //console.log(result,22)
  //     console.log(result,33)
  //   });
  // });

   // console.log(authenticateImage);
  //  await page.waitFor('#validCode');
  //     await page.waitForFunction(function() {
  // const validCode = document.getElementById('validCode').value;
  // return validCode.length == 4;
  //  });
   try {
    await page.waitForFunction(
      'document.getElementById("validCode").value.length ===4'
    );
  } catch(e) {
   console.log(e);
  }
    
    await page.click('#loginBtn');
    await page.waitFor(4000);
    await page.goto(req.body.beturl,{waitUntil: 'networkidle2',timeout: 30000000});
    if(req.body.bettype ==='Back All') {
    setInterval(async function(){

       await page.waitFor(`#fullMarketBoard tr:nth-child(${betrow}) td#back_1.back-1`);
    await page.click(`#fullMarketBoard tr:nth-child(${betrow}) td#back_1.back-1`);
    await page.waitFor(200);
    await page.keyboard.press("Tab");
    await page.waitFor(500);
    await page.waitFor('dd.col-stake input[id=inputStake]');
     await page.type('dd.col-stake input[id=inputStake]', req.body.stakevalue);
    await page.waitFor('#placeBets');
    await page.waitFor(100);
    await page.click('#placeBets');  
    },1500)
  }
  if(req.body.bettype ==='Lay All') {
    setInterval(async function(){

      await page.waitFor(`#fullMarketBoard tr:nth-child(${betrow}) td#lay_1.lay-1`);
   await page.click(`#fullMarketBoard tr:nth-child(${betrow}) td#lay_1.lay-1`);
   await page.waitFor(200);
   await page.keyboard.press("Tab");
   await page.waitFor(500);
   await page.waitFor('dd.col-stake input[id=inputStake]');
    await page.type('dd.col-stake input[id=inputStake]', req.body.stakevalue);
   await page.waitFor('#placeBets');
   await page.waitFor(100);
   await page.click('#placeBets');  
   },1500)
  }
  })();
});

module.exports = router;
