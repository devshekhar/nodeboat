var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  console.log(req.body.betweb);
  (async () => {
    const browser = await puppeteer.launch({headless: false,args: [
    '--window-size=1366,768',
  ]});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto(req.body.beturl,{waitUntil: 'networkidle2'});
  
    await page.type('#loginName', req.body.username);
    await page.type('#password', req.body.password);
      await page.waitForFunction(() => {
  const validCode = document.getElementById('validCode').value;
  return validCode.length == 4;
   });
    
    await page.click('#loginBtn');
    await page.waitFor(4000);
    await page.goto(req.body.beturl,{waitUntil: 'networkidle2'});
    setInterval(async function(){
       await page.waitFor('#fullMarketBoard tr:nth-child(3) td#back_1.back-1');
    await page.click('#fullMarketBoard tr:nth-child(3) td#back_1.back-1');
    await page.waitFor(500);
    await page.keyboard.press("Tab");
    await page.waitFor(500);
    await page.waitFor('dd.col-stake input[id=inputStake]');
     await page.type('dd.col-stake input[id=inputStake]', req.body.stakevalue);
    await page.waitFor('#placeBets');
    await page.waitFor(1000);
    await page.click('#placeBets');  
    },5000)
  })();
});

module.exports = router;
