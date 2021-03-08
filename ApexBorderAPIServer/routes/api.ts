import express from 'express';
import { isString } from 'util';
import config from '../config.json';
import { RPLog } from '../entities/rpLog';
import * as api from '../logics/apiFunction';
const router = express.Router();

router.get('/rplogs', async (req: express.Request, res: express.Response) => {
  try {
    const beginning = req.query.beginning;
    const ending = req.query.ending;
    const season = config.env.SEASON;
    let rpLogs: RPLog[] = [];
    // 期間の指定があるかどうか
    if (isString(beginning) && isString(ending)) {
      rpLogs = await api.getRPLogsBetweenAsync(beginning, ending, season);
    } else {
      rpLogs = await api.getRPLogsOnSeasonAsync(season);
    }
    res.status(200);
    res.json(rpLogs);
  } catch (e) {
    res.status(500);
    res.json('{ "error": "Creating response was failed." }');
  }
});

router.get('/currentborders', async (req: express.Request, res: express.Response) => {
  try {
    const currentBoders = await api.getCurrentBordersAsync();
    res.status(200);
    res.json(currentBoders);
  } catch (e) {
    res.status(500);
    res.json('{ "error": "Creating response was failed." }');
  }
});

export default router;