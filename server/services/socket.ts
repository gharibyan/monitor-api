import FileReader from "./fileReader";
import Os from './os';

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
            console.log('checkConnectedSockets:connectedSockets', Object.keys(this.io.sockets.sockets).length);
            if (Object.keys(this.io.sockets.sockets).length) {
                this.io.sockets.emit('serverHealthCheck', d);
            }
        }, 5000)
    }

    subscribeToFileReader() {
        const FOLDER_PATH:string = process.env.LOG_FOLDER || '';
        const fileReader = new FileReader(FOLDER_PATH);
        fileReader.listen((lastLine: object) => {
            if (this.io.sockets) {
                this.io.sockets.emit('lastLine', lastLine);
            }
        })
    }
}

export default Socket
