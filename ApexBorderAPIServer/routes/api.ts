import * as express from 'express';
import { RPLog } from '../entities/rpLog';
import { Between } from 'typeorm';
import { isString } from 'util';
import DBManager from '../db/dbManager';
const router = express.Router();

router.get('/rplogs', async (req: express.Request, res: express.Response) => {
    const beginning = req.query.beginning;
    const ending = req.query.ending;
    const season = Number(process.env.SEASON);
    const connection = await DBManager.getConnectedConnection();
    const repository = connection.getRepository(RPLog);
    let rpLogs: RPLog[];
    // 期間の指定があるかどうか
    if (isString(beginning) && isString(ending)) {
        // 期間内の記録を取得
        rpLogs = await repository.find({
            where: {
                season: season,
                date: Between(beginning as string + ' 00:00:00', ending as string + ' 23:59:59'),
            },
            order: {
                date: 'ASC'
            }
        });
    } else {
        // シーズン内の記録を取得
        rpLogs = await repository.find({
            where: {
                season: season
            }
        });
    }
    await connection.close();
    res.json(rpLogs);
});

router.get('/currentborder', async (req: express.Request, res: express.Response) => {

    res.json();
});

export default router;