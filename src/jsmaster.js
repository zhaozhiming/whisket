const puppeteer = require('puppeteer');
const axios = require('axios');

const DINGDING_ROBOT =
  'https://oapi.dingtalk.com/robot/send?access_token=2f5119f69f5437297e555c58e141f5d9441935cc5574586287a985664011a7b3';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://twitter.com/kingzzm/lists/js-master');
  const tws = await page.$$eval(
    'li.js-stream-item.stream-item.stream-item',
    tw => {
      console.log({ tw });
      const header = tw.querySelector('.stream-item-header small a span');
      return {
        time: +header.getAttribute('data-time-ms'),
      };
    }
  );
  console.log({ tws });

  // for (const tw of tws) {
  //   const header = tw.$('.stream-item-header small a span');
  //   const time = +header['data-time-ms'];
  //   console.log({ time });
  //   if (time < Date.now() - 24 * 60 * 60 * 1000) continue;

  //   const retw = tw.$(
  //     '.stream-item-footer .ProfileTweet-actionButton.js-actionButton.js-actionRetweet .ProfileTweet-actionCountForPresentation'
  //   );
  //   const retwCount = +retw.innerText;
  //   console.log({ retwCount });
  //   if (retwCount < 30) continue;

  //   const link = tw.$(
  //     '.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable'
  //   );
  //   const url = `https://twitter.com${link['data-permalink-path']}`;
  //   console.log({ url });
  //   await axios.post(DINGDING_ROBOT, {
  //     msgtype: 'text',
  //     text: {
  //       content: url,
  //     },
  //   });
  // }
  await browser.close();
})();
