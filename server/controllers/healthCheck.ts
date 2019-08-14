import {Request, Response, NextFunction} from 'express'
import Os from '../services/os';


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

    static async lastErrorLines(_: Request, res: Response, next: NextFunction) {
        try {

            return res.status(200).json({})
        } catch (err) {
            return next(err)
        }
    }
}


export default HealthCheck;
