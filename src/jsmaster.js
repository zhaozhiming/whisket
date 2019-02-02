const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const getUrl = maxPos => {
  const maxQuery = maxPos > 0 ? `&max_position=${maxPos}` : '';
  return `https://twitter.com/kingzzm/lists/js-master/timeline?include_available_features=1&include_entities=1${maxQuery}&reset_error_state=false`;
};

const getMyWant = document => {
  const tws = document.querySelectorAll(
    'li.js-stream-item.stream-item.stream-item'
  );
  for (const tw of tws) {
    const retwElem = tw.querySelector('.tweet-context.with-icn span a');
    const isRetw = retwElem ? true : false;
    // console.log({ isRetw });

    const timeElem = tw.querySelector('.stream-item-header small a span');
    const time = +timeElem.getAttribute('data-time-ms');
    console.log({ time, date: new Date(time) });
    // if (!isRetw && time < Date.now() - 24 * 60 * 60 * 1000) break;

    const retwCountElem = tw.querySelector(
      '.stream-item-footer .ProfileTweet-actionButton.js-actionButton.js-actionRetweet .ProfileTweet-actionCountForPresentation'
    );
    const retwCount = +retwCountElem.textContent;
    // console.log({ retwCount });
    // if (retwCount < 30) continue;

    const infoElem = tw.querySelector(
      '.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable'
    );
    const id = infoElem.getAttribute('data-tweet-id');
    const link = infoElem.getAttribute('data-permalink-path');
    const url = `https://twitter.com${link}`;
    console.log({ id });
  }
};

(async () => {
	const max = 0
  const resp = await axios.get(getUrl(max));
  const { data } = resp;
  console.log({ min: data['min_position'], max });
  const dom = new JSDOM(data['items_html']);
  getMyWant(dom.window.document);
})();
