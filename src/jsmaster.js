const axios = require('axios');
const jsdom = require('jsdom');
const { DINGDING_ROBOT, TW_LISTS } = require('./config');

const { JSDOM } = jsdom;

const sendDingding = async (infos, list) => {
  const text = infos
    .map(
      ({ content, author, url }) => `#### ${author}

${content}

[链接](${url})`
    )
    .join('\n');
  await axios.post(DINGDING_ROBOT, {
    msgtype: 'markdown',
    markdown: {
      title: list,
      text,
    },
  });
};

const getUrl = (maxPos, list) => {
  const maxQuery = maxPos > 0 ? `&max_position=${maxPos}` : '';
  return `https://twitter.com/kingzzm/lists/${list}/timeline?include_available_features=1&include_entities=1${maxQuery}&reset_error_state=false`;
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

const fetchTw = async list => {
  let max = 0;
  let infos = [];
  while (true) {
    const resp = await axios.get(getUrl(max, list));
    const { data } = resp;
    const dom = new JSDOM(data['items_html']);
    const result = await getMyWant(dom.window.document);
    infos = [...infos, ...result.infos];
    if (result.isStop) break;

    max = result.nextMax;
  }
  await sendDingding(infos, list);
};

(async () => {
  for (const list of TW_LISTS) {
    await fetchTw(list);
  }
})();
