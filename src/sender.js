const axios = require('axios');
const { ROBOT_URL } = require('./config');

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

[link](${url})`
    )
    .join('\n');
  await axios.post(ROBOT_URL, {
    msgtype: 'markdown',
    markdown: {
      content: text,
    },
  });
};

module.exports = {
  sendMessage,
};
