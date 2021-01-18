/* eslint-disable no-restricted-syntax */
const _random = require('lodash/random');

const { logger } = require('../utils');

const watchVideosInSequence = async (page, ipAddr, targetUrlsList, durationInSeconds) => {
  for (const url of targetUrlsList) {
    await page.goto(url, { waitUntil: 'load' });
    try {
      // One of these SELECTORs should appear, we don't know which
      await page.waitForFunction(() => {
        return document.querySelectorAll('.view-count' + ", " + '.live-time').length;
      }, {timeout:300000}); 
      // await page.waitForSelector('.view-count', { timeout: 30000 });
      // await page.waitFor(30 * 1000);
      // await page.waitForSelector('.ytp-time-duration', { timeout: 30000 });
      await page.mouse.click(100, 100);
      // const totalTime = await page.evaluate(() => {
      //   return Array.from(document.getElementsByClassName("ytp-time-duration")).map(d => {
      //     const min = parseInt(d.innerText.split(":")[0]) * 60
      //     return parseInt(d.innerText.split(":")[1]) + min 
      //   });
      // });
      // const percentageToWatch = 10 + Math.ceil(Math.random()*100) % 50;
      // const duration = Math.ceil((totalTime/100) * percentageToWatch);
      // console.log(totalTime,percentageToWatch,duration)
      const duration = (durationInSeconds + _random(-(durationInSeconds / 6), (durationInSeconds / 6), true));
      await page.waitFor(duration * 1000);
      await page.mouse.click(100, 100);
      await logger.logCount(page, url, ipAddr, duration);
    } catch(e) {
      console.error("Exception thrown", e.stack);
      logger.logFailedAttempt(url, ipAddr);
    }
  }
};

module.exports = { watchVideosInSequence };
