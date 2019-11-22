const fs = require('fs');
const readLastLines = require('read-last-lines');

interface Line {
    file: String,
    data: Array<string> | null
}

import Slack from './slack';

const slack = new Slack();

class FileReader {
    filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath
    }

    async readLines(file: string, lineNumbers: number) {
        const lines: String = await readLastLines.read(`${this.filePath}${file}`, lineNumbers);
        const response: Line = {
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
        fs.watch(`${this.filePath}`, async (_: any, filename: any) => {
            if (filename.includes('.log') && fs.existsSync(`${this.filePath}${filename}`)) {
                const lastLine: string = await readLastLines.read(`${this.filePath}${filename}`, 1);
                if (filename.includes('error') && slack.slackActive) {
                    slack.send(`error:${filename} -- ${lastLine}`, 'bug')
                }
                cb({filename, data: lastLine})
            }
        })
    }

}


export default FileReader
