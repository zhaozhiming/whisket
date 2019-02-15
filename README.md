# Twitter List Messages Filter

## 🤔 Background

I use Twitter for learning newest technology and news everyday, and I distinguish between different technical content by creating several Twitter lists.

The question is: the Twitter messages have too much noise that making me have to use many time to read them finish.

I want a auto-filter program or shell script to let me gain the messages I readlly want. That is the goal of this repository.


## 🏇 Usage

You can set your Twitter accout name and list name in `src/config.js`.

```js
// Twitter account
const TWITTER_ACCOUNT = 'account'; // replace it to your Twitter accout

// Your Twitter list
const TWITTER_LISTS = ['foo', 'bar']; // replace it to your Twitter list
```

When the Twitter messages fetch finish, it will send the filter result to the [DingDing](https://www.dingtalk.com/)(something like Slack in China) robot. You can config the DingDing robot url in `src/config.js`.


```js
const DINGDING_ROBOT =
  'https://oapi.dingtalk.com/robot/send?access_token=your_access_token';
```

Certainly you can replace DingDing with the other chat application with robot or even email, just overwrite the `src/sender.js`:

```js
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
export const sendMessage  = async (infos, list) => {
  // Overwrite this function
}
```

When you config these items finish, you can execute command as follow to run the program:

```js
# goto project root directory
cd whisket
# install libs
yarn
# run the program
yarn run server
```

The sended result like this:

```markdown
#### MICHAEL JACKSON
Do you know a language other than English? Do you love #ReactJS? Join in the translation of the React website into your language! https://www.isreacttranslatedyet.com/

[链接](https://twitter.com/mjackson/status/1095461458270314497)
```

## 📒 Filter Rules

* The retwitter count >= 30
* The Twitter massage time <= last 24 hours


## 🏓 TODO

- [x] use markdown send dingding message
- [x] make project name not so crawler
- [x] apply other lists
- [x] move the project to the gcp
