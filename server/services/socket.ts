import FileReader from "./fileReader";
import Os from './os';
const INTERVAL = process.env.INTERVAL || 1000;
class Socket {
    io: any;
    timer: any;

    constructor(http: any) {
        this.io = require("socket.io")(http, {
            origins: '*:*', extraHeaders: {
                'Access-Control-Allow-Credentials': 'omit'
            }
        });
        this.timer = false;
    }

    init() {
        this.io.on('connection', () => {
        });
        this.subscribeToFileReader();
        this.subscribeServerHealthCheck();
    }

    subscribeServerHealthCheck() {
        this.timer = setInterval(async () => {
            const usage = await Os.cpuUsage();
            const free = await Os.cpuFree();
            const d = {...Os.infos, cpuUsage: usage, cpuFree: free};
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
