import * as express from 'express';
import { getCurrentBordersAsync, getRPLogsAsync } from '../logics/apiFunc';
const router = express.Router();

router.get('/rplogs', async (req: express.Request, res: express.Response) => {
    const rpLogs = await getRPLogsAsync(req);
    res.json(rpLogs);
});

router.get('/currentborders', async (req: express.Request, res: express.Response) => {
    const currentBoders = await getCurrentBordersAsync();
    res.json(currentBoders);
});

export default router;