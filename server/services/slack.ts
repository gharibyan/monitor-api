
class Slack {
    slack: any;

    constructor() {
        if (process.env.SLACK_HOOK_URL) {
            this.slack = require('slack-notify')(process.env.SLACK_HOOK_URL)
        } else {
            this.slack = false;
        }
    }

    get slackActive() {
        return this.slack
    }

    send(text: string | object, type:string = 'send') {
        if (!this.slack) {
            return console.info(`Slack is not setup`)
        }
        this.slack[type]({
            channel: `#${process.env.SLACK_CHANNEL || 'monitor-api'}`,
            text: text,
        });
    }
}


export default Slack
