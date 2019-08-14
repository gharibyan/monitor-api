import * as express from 'express';
import * as cors from "cors";
import * as bodyParser from 'body-parser';
import Routes from './routes';
import {Request, Response} from "express";

export const createServer = () => {
    const app = express();
    const port: string | number = process.env.PORT || 7001;


    app.set('port', port);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cors());

    app.use(Routes);

    app.use((_: Request, res: Response) => {
        res.status(404).json({
            message: '0_o Not found'
        })
    });


    return app
};



