//https://hooks.slack.com/services/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

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

    send(text: string | object) {
        if (!this.slack) {
            return console.info(`Slack is not setup`)
        }
        this.slack.send({
            channel: `#${process.env.SLACK_CHANNEL || 'monitor-api'}`,
            text: text,
        });
    }
}


export default Slack
