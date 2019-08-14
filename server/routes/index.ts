import * as express from 'express'
import HealthCheckRoutes from './healthCheck';


const router = express.Router();
const apiRoutes: Array<object> = [
    {
        route: '/health-check',
        module: [HealthCheckRoutes],
    }];

for (const val of apiRoutes) {
    const data = val as any;
    router.use(data.route, data.module);
}

export default router;
