const fs = require('fs');
const readLastLines = require('read-last-lines');


class FileReader {
    filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath
    }

    async getLasFileLines(linesNumbers = 10) {
        return readLastLines.read(this.filePath, linesNumbers);
    }

    listen(cb: Function) {
        const files:Array<string> = fs.readdirSync(this.filePath);
        console.log('listeningLogFiles', files);
        for (const file of files) {
            if(file.includes('.log')){
                fs.watchFile(`${this.filePath}${file}`, async () => {
                    console.log(`${this.filePath}${file}`, 'has some changes');
                    const lastLine: string = await readLastLines.read(`${this.filePath}${file}`, 1);
                    cb({file, lastLine})
                })
            }
        }
    }

}


export default FileReader
