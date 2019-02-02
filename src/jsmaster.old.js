const puppeteer = require('puppeteer');
const axios = require('axios');

const DINGDING_ROBOT =
  'https://oapi.dingtalk.com/robot/send?access_token=2f5119f69f5437297e555c58e141f5d9441935cc5574586287a985664011a7b3';

const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

const extractItems = () => {
  const extractedElements = document.querySelectorAll(
    'li.js-stream-item.stream-item.stream-item'
  );
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
};

const scrapeInfiniteScrollItems = async (
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) => {
  let items = [];
  try {
    let previousHeight;
    console.log({ il: items.length, target: itemTargetCount });
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      console.log({ ic: items.length, previousHeight });
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      console.log(1);
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      console.log(2);
      await page.waitFor(scrollDelay);
      console.log(3);
    }
  } catch (e) {
    console.log(e);
  }
  return items;
};

const sendDingding = async url => {
  await axios.post(DINGDING_ROBOT, {
    msgtype: 'text',
    text: {
      content: url,
    },
  });
};

const getMyWant = async page => {
  const tws = await page.$$('li.js-stream-item.stream-item.stream-item');
  for (const tw of tws) {
    let isRetw = false;
    try {
      await tw.$eval('.tweet-context.with-icn span a', e =>
        e.getAttribute('data-user-id')
      );
      isRetw = true;
    } catch (e) {
      isRetw = false;
    }
    console.log({ isRetw });

    const time = await tw.$eval(
      '.stream-item-header small a span',
      e => +e.getAttribute('data-time-ms')
    );
    console.log({ time, date: new Date(time) });
    if (!isRetw && time < Date.now() - 24 * 60 * 60 * 1000) break;

    const retwCount = await tw.$eval(
      '.stream-item-footer .ProfileTweet-actionButton.js-actionButton.js-actionRetweet .ProfileTweet-actionCountForPresentation',
      e => +e.innerText
    );
    console.log({ retwCount });
    if (retwCount < 30) continue;

    const info = await tw.$eval(
      '.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable',
      e => e.getAttribute('data-permalink-path')
    );
    console.log({ info });
    const url = `https://twitter.com${info.link}`;
  }
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://twitter.com/kingzzm/lists/js-master', {
    timeout: 10 * 1000,
  });

  const items = await scrapeInfiniteScrollItems(page, extractItems, 100);

  console.log({ length: items.length });

  await browser.close();
})();
