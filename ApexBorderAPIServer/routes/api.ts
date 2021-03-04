import * as express from 'express';
import { RPLog } from '../entities/rpLog';
import { getConnection, Between } from 'typeorm';
import { isString } from 'util';
const router = express.Router();

router.get('/rpLogs', async (req: express.Request, res: express.Response) => {
    const beginning = req.query.beginning;
    const ending = req.query.ending;
    const season = Number(process.env.SEASON);
    const connection = getConnection();
    if (!connection.isConnected) {
        await connection.connect().catch(err => console.log(err));
    }
    const repository = connection.getRepository(RPLog);
    let rpLogs: void | RPLog[];
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
        }).catch(err => console.log(err));
    } else {
        // シーズン内の記録を取得
        rpLogs = await repository.find({
            where: {
                season: season
            }
        }).catch(err => console.log(err));
    }
    await connection.close().catch(err => console.log(err));
    res.json(rpLogs);
});

export default router;