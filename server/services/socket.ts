import FileReader from "./fileReader";
import Os from './os';
import Slack from './slack';

const slack = new Slack();

const INTERVAL = process.env.INTERVAL || 1000;



class Socket {
    io: any;
    timer: any;
    buffer: Array<number>

    constructor(http: any) {
        this.io = require("socket.io")(http, {
            origins: '*:*', extraHeaders: {
                'Access-Control-Allow-Credentials': 'omit'
            }
        });
        this.timer = false;
        this.buffer = []
    }

    init() {
        this.io.on('connection', () => {
        });
        this.subscribeToFileReader();
        this.subscribeServerHealthCheck();
    }

    subscribeServerHealthCheck() {
        this.timer = setInterval(async () => {
            const usage: any | number = await Os.cpuUsage();
            const free = await Os.cpuFree();
            const d = {...Os.infos, cpuUsage: usage, cpuFree: free};
            if (usage >= 0.8) {
                this.buffer.push(usage);
            }
            if (this.buffer.length >= 20) {
                const sum: number = this.buffer.reduce((a, b) => a + b, 0);
                const avg: number = sum / this.buffer.length;
                const high: number = Math.max(...this.buffer);
                const low: number = Math.min(...this.buffer);
                if (slack.slackActive) {
                    const avgText:string = `CPU avg: ${(avg * 100).toFixed(2)}%`;
                    const highText:string = `high: ${(high * 100).toFixed(2)}%`;
                    const lowText:string = `low: ${(low * 100).toFixed(2)}%`;
                    slack.send(`${avgText} ${highText} ${lowText}`)
                }
                this.buffer = [];
            }

            if (Object.keys(this.io.sockets.sockets).length) {
                this.io.sockets.emit('serverHealthCheck', d);
            }
        }, INTERVAL)
    }

    subscribeToFileReader() {
        const FOLDER_PATH: string = process.env.LOG_FOLDER || '';
        const fileReader = new FileReader(FOLDER_PATH);
        fileReader.listen((lastLine: object) => {
            if (Object.keys(this.io.sockets.sockets).length) {
                this.io.sockets.emit('lastLine', lastLine);
            }
        })
    }
}

export default Socket
