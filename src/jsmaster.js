const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const DINGDING_ROBOT =
  'https://oapi.dingtalk.com/robot/send?access_token=2f5119f69f5437297e555c58e141f5d9441935cc5574586287a985664011a7b3';

const sendDingding = async ({ author, content, url }) => {
  await axios.post(DINGDING_ROBOT, {
    msgtype: 'markdown',
    markdown: {
      title: author,
      text: `${content} [链接](${url})`,
    },
  });
};

const getUrl = maxPos => {
  const maxQuery = maxPos > 0 ? `&max_position=${maxPos}` : '';
  return `https://twitter.com/kingzzm/lists/js-master/timeline?include_available_features=1&include_entities=1${maxQuery}&reset_error_state=false`;
};

const shouldStopLoop = tw => {
  const retwElem = tw.querySelector('.tweet-context.with-icn span a');
  const isRetw = retwElem ? true : false;

  const timeElem = tw.querySelector('.stream-item-header small a span');
  const time = +timeElem.getAttribute('data-time-ms');
  return !isRetw && time < Date.now() - 24 * 60 * 60 * 1000;
};

const getMyWant = async document => {
  const tws = Array.from(
    document.querySelectorAll('li.js-stream-item.stream-item.stream-item')
  );

  const twids = tws.map(tw => {
    const infoElem = tw.querySelector(
      '.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable'
    );
    return infoElem.getAttribute('data-tweet-id');
  });
  const nextMax = twids[twids.length - 1];
  const isStop = tws.some(tw => shouldStopLoop(tw));

  const infos = tws
    .filter(tw => {
      const retwCountElem = tw.querySelector(
        '.stream-item-footer .ProfileTweet-actionButton.js-actionButton.js-actionRetweet .ProfileTweet-actionCountForPresentation'
      );
      const retwCount = +retwCountElem.textContent;
      return !shouldStopLoop(tw) && retwCount >= 30;
    })
    .map(tw => {
      const infoElem = tw.querySelector(
        '.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable'
      );
      const link = infoElem.getAttribute('data-permalink-path');
      const author = infoElem.getAttribute('data-name');

      const contentElem = tw.querySelector('.js-tweet-text-container p');
      const content = contentElem.textContent;

      return {
        author,
        content,
        url: `https://twitter.com${link}`,
      };
    });

  return {
    isStop,
    nextMax,
    infos,
  };
};

(async () => {
  let max = 0;
  while (true) {
    const resp = await axios.get(getUrl(max));
    const { data } = resp;
    const dom = new JSDOM(data['items_html']);
    const result = await getMyWant(dom.window.document);
    for (const info of result.infos) {
      await sendDingding(info);
    }
    if (result.isStop) break;

    max = result.nextMax;
  }
})();
