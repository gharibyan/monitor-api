import * as express from 'express'
import {HealthCheck as HealthCheck} from '../controllers'

const router = express.Router();


router.route('/')
    .get(HealthCheck.info)



export default router;
