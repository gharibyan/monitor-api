import {Request, Response, NextFunction} from 'express'
import FileReader from "../services/fileReader";
import Os from '../services/os';
const FOLDER_PATH: string = process.env.LOG_FOLDER || '';
const fileReader = new FileReader(FOLDER_PATH);

class HealthCheck {

    static async info(_: Request, res: Response, next: NextFunction) {
        try {
            const usage = await Os.cpuUsage();
            const free = await Os.cpuFree();
            return res.status(200).json({...Os.infos, cpuUsage: usage, cpuFree: free});
        } catch (err) {
            return next(err)
        }
    }

    static async lastLogs(_: Request, res: Response, next: NextFunction) {
        try {
            const response = await fileReader.getLasFileLines();
            return res.status(200).json(response)
        } catch (err) {
            return next(err)
        }
    }
}


export default HealthCheck;
