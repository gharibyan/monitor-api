interface Os {
    platform:Function,
    cpuCount:Function,
    sysUptime:Function,
    freemem:Function,
    totalmem:Function,
    freememPercentage:Function,
    loadavg:Function,
    cpuFree:Function,
    cpuUsage:Function
}

const os:Os = require('os-utils');


class Os {
    static async cpuUsage() {
        return new Promise((resolve) => {
            os.cpuUsage((usage: number) => {
                return resolve(usage)
            });
        })
    }

    static async cpuFree() {
        return new Promise((resolve) => {
            os.cpuFree((free: number) => {
                return resolve(free)
            });
        })
    }

    static get infos() {
        return {
            platform: os.platform(),
            cpuCount: os.cpuCount(),
            freeMem: os.freemem(),
            totalMem: os.totalmem(),
            freePercentage: os.freememPercentage(),
            avgLoad: os.loadavg(5)
        }
    }
}

export default Os;
