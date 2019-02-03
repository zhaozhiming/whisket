const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const DINGDING_ROBOT =
  'https://oapi.dingtalk.com/robot/send?access_token=2f5119f69f5437297e555c58e141f5d9441935cc5574586287a985664011a7b3';

const sendDingding = async url => {
  await axios.post(DINGDING_ROBOT, {
    msgtype: 'text',
    text: {
      content: url,
    },
  });
};

const getUrl = maxPos => {
  const maxQuery = maxPos > 0 ? `&max_position=${maxPos}` : '';
  return `https://twitter.com/kingzzm/lists/js-master/timeline?include_available_features=1&include_entities=1${maxQuery}&reset_error_state=false`;
};

const getMyWant = async document => {
  const tws = document.querySelectorAll(
    'li.js-stream-item.stream-item.stream-item'
  );
  let isStop = false;
  let nextMax = 0;
  for (const tw of tws) {
    const infoElem = tw.querySelector(
      '.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable'
    );
    nextMax = infoElem.getAttribute('data-tweet-id');

    const retwElem = tw.querySelector('.tweet-context.with-icn span a');
    const isRetw = retwElem ? true : false;

    const timeElem = tw.querySelector('.stream-item-header small a span');
    const time = +timeElem.getAttribute('data-time-ms');
    console.log({ time, date: new Date(time) });
    if (!isRetw && time < Date.now() - 24 * 60 * 60 * 1000) {
      isStop = true;
      break;
    }

    const retwCountElem = tw.querySelector(
      '.stream-item-footer .ProfileTweet-actionButton.js-actionButton.js-actionRetweet .ProfileTweet-actionCountForPresentation'
    );
    const retwCount = +retwCountElem.textContent;
    if (retwCount < 30) continue;

    const link = infoElem.getAttribute('data-permalink-path');
    const url = `https://twitter.com${link}`;
    await sendDingding(url);
  }

  return {
    isStop,
    nextMax,
  };
};

(async () => {
  let max = 0;
  while (true) {
    const resp = await axios.get(getUrl(max));
    const { data } = resp;
    const dom = new JSDOM(data['items_html']);
    const result = await getMyWant(dom.window.document);
    if (result.isStop) break;

    max = result.nextMax;
  }
})();
