if (!process.env.LOG_FOLDER) {
    throw new Error('Log folder path is required');
}

import {createServer} from './server'
import Socket from "./services/socket";

const app = createServer();
const server = require('http').createServer(app);
server.listen(app.get('port'));
const s = new Socket(server);
s.init();
console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
