const axios = require('axios');
const { DINGDING_ROBOT } = require('./config');

/**
 * Send message to anywhere you want
 * @param infos: Twitter filter result, data format like this:
			[
				{
				  content, // Twitter content
				  author, // Twiiter creator
				  url,  // Twitter url
				},
			]
 * @param list: Twitter list name
 */
const sendMessage = async (infos, list) => {
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

module.exports = {
  sendMessage,
};
