const fs = require('fs');
const readLastLines = require('read-last-lines');
interface Line {
    file:String,
    data:Array<string>|null
}

import Slack from './slack';

const slack = new Slack();

class FileReader {
    filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath
    }

    async readLines(file: string, lineNumbers: number) {
        const lines:String = await readLastLines.read(`${this.filePath}${file}`, lineNumbers);
        const response:Line = {
            file: file,
            data: lines ? lines.split('\n') : null
        };
        return response;
    }


    async getLasFileLines(linesNumbers = 10) {
        const files: Array<string> = fs.readdirSync(this.filePath);
        const arr: Array<Promise<object>> = [];
        for (const file of files) {
            if (file.includes('.log')) {
                arr.push(this.readLines(file, linesNumbers))
            }
        }
        return Promise.all(arr)
    }

    listen(cb: Function) {
        const files: Array<string> = fs.readdirSync(this.filePath);
        console.log('listeningLogFiles', files);
        for (const file of files) {
            if (file.includes('.log')) {
                fs.watchFile(`${this.filePath}${file}`, async () => {
                    const lastLine: string = await readLastLines.read(`${this.filePath}${file}`, 1);
                    if (file.includes('error')  && slack.slackActive) {
                        slack.send(`error:${file} -- ${lastLine}`, 'bug')
                    }
                    cb({file, data:lastLine})
                })
            }
        }
    }

}


export default FileReader
