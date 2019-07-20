# Twitter List Messages Filter

## 🤔 Background

I use Twitter for learning newest technology and news everyday, and I distinguish between different technical content by creating several Twitter lists.

The question is there are too much noise in the Twitter messages hthat making me have to use many time to read them finish.

I want a auto-filter program or shell script to let me gain the messages I readlly want. That is the goal of this repository.


## 🏇 Usage

You can set your Twitter accout name and list name in `src/config.js`.

```js
// Twitter account
const TWITTER_ACCOUNT = 'account'; // replace it to your Twitter accout

// Your Twitter list
const TWITTER_LISTS = ['foo', 'bar']; // replace it to your Twitter list
```

When the Twitter messages fetch finish, it will send the filter result to the chat sofeware robot, such like Slack or [DingDing](https://www.dingtalk.com/)(something like Slack in China) robot. You can config the robot url in `src/config.js`.

```js
const ROBOT_URL =
  'https://oapi.dingtalk.com/robot/send?access_token=your_access_token';
```

Certainly you can replace robot with the other chat application with robot or even email, just overwrite the `src/sender.js`:

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

When you finish these config items, you can execute the command as follow to run the program:

```sh
# goto the project root directory
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

[Link](https://twitter.com/mjackson/status/1095461458270314497)
```

## 🏓 Auto-run everyday

You can use the [Crontab](https://en.wikipedia.org/wiki/Cron) to run program in a schedule time(like everyday). You can add the `cron-command` file to crontab schedule.


## 📒 Filter Rules

* The retwitter count >= 30
* The Twitter massage time <= last 24 hours

You can change the rules value in `src/config.js`:

```sh
// filter rule: time
const LAST_TIME = 24 * 60 * 60 * 1000;

// filter rule: time
const RETWITTER_COUNT = 30;
```
