import DBManager from "../db/dbManager";
import { isString } from "util";
import * as express from 'express';
import { RPLog } from "../entities/rpLog";
import { Between } from "typeorm";
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import moment = require("moment");

export const platForms: { [key: string]: string } = {
    'origin': 'origin',
    'ps': 'psn',
    'xbox': 'xbl'
}

export async function getRPLogsAsync(req: express.Request): Promise<RPLog[]> {
    const beginning = req.query.beginning;
    const ending = req.query.ending;
    const season = process.env.SEASON;
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
    return rpLogs;
}

async function getCurrentBorderAsync(plat: string): Promise<number> {
    const border = Number(process.env.BORDER);
    const playersPerPage = Number(process.env.PLAYERS_PER_PAGE);
    const targetPage = Math.ceil(border / playersPerPage);
    const url = `https://tracker.gg/apex/leaderboards/stats/${plat}/RankScore?page=${targetPage}`;
    const res = await fetch(url).catch(err => { throw err });
    const html = await res.text().catch(err => { throw err });
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const nodes = document.querySelectorAll('td.highlight');
    const rpList = Array.from(nodes).map((td?: any) => Number(td.textContent.trim().replace(/[^0-9]/g, '')));
    let borderRp = -1;
    if (rpList.length === playersPerPage) {
        borderRp = rpList[49];
    } else {
        throw new Error('rpList.Length = ${rpList.length} is not equals.');
    }
    return borderRp;
}

export async function getCurrentBordersAsync(): Promise<{
    date: string;
    borders: { [key: string]: number };
}> {
    const borders: { [key: string]: number } = {}
    for (const plat of Object.keys(platForms)) {
        borders[plat] = await getCurrentBorderAsync(platForms[plat]).catch(err => {
            console.log(err);
            return -1;
        });
    }
    const currentBorders: {
        date: string;
        borders: { [key: string]: number };
    } = {
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        borders: borders
    }
    return currentBorders;
}


