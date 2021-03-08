import * as express from 'express';
import * as api from '../logics/apiFunction';
import RPLog from '../entities/rpLog';
const router = express.Router();

router.get('/rplogs', async (req: express.Request, res: express.Response) => {
  let rpLogs: RPLog[] = [];
  try {
    rpLogs = await api.getRPLogsAsync(req);
    res.status(200);
  } catch (e) {
    res.status(500);
    res.json(rpLogs);
  }
});

router.get('/currentborders', async (req: express.Request, res: express.Response) => {
  let currentBoders: {
    date: string;
    borders: { [key: string]: number };
  }
  try {
    currentBoders = await api.getCurrentBordersAsync();
    res.status(200);
    res.json(currentBoders);
  } catch (e) {
    res.status(500);
  }
});

export default router;