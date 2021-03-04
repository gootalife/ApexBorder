import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { RPLog } from './entities/rpLog';
import * as moment from 'moment';
import DBManager from './db/dbManager';
import { getConnection } from 'typeorm';
require('array-foreach-async');

const rpLog = new RPLog(moment().format("YYYY-MM-DD HH:mm:ss"), Number(process.env.SEASON));
const border = Number(process.env.BORDER);
const playersPerPage = Number(process.env.PLAYERS_PER_PAGE);
const platForms: { [key: string]: string } = {
    'origin': 'origin',
    'ps': 'psn',
    'xbox': 'xbl'
}

async function getRPList(plat: string): Promise<number[]> {
    let rpList: number[] = [];
    const lastPage = Math.ceil(border / playersPerPage);
    for (let page = 1; page <= lastPage; page++) {
        process.stderr.write(`\r${plat}: ${page}/${lastPage}`);
        const url = `https://tracker.gg/apex/leaderboards/stats/${plat}/RankScore?page=${page}`;
        const res = await fetch(url).catch(err => { throw err });
        const html = await res.text().catch(err => { throw err });
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const nodes = document.querySelectorAll('td.highlight');
        const onePage = Array.from(nodes).map((td?: any) => Number(td.textContent.trim().replace(/[^0-9]/g, '')));
        rpList = rpList.concat(onePage);
    }
    // ボーダーまで切り捨て
    rpList = rpList.slice(0, border);
    process.stderr.write(` done!\n`);
    return rpList;
}

const main = async () => {
    console.log('---Daily process start---');
    for (const plat of Object.keys(platForms)) {
        rpLog[plat] = await getRPList(platForms[plat]).catch(err => {
            console.log(err);
            return [];
        });
        if (rpLog[plat].length !== border) {
            throw new Error(`rpLog.${plat}.length not equals ${border}.`);
        }
    }

    console.log('DB Update start.');
    await DBManager.createConnection().catch(err => console.log(err));
    const connection = getConnection();
    const repository = connection.getRepository(RPLog);
    await repository.save(rpLog).catch(err => console.log(err));
    await connection.close();
    console.log('DB was Updated.');
    console.log('---Daily process end---');
};

main().catch(err => console.log(err));