/* eslint no-useless-catch: 0 */
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { Between } from 'typeorm';
import config from '../config.json';
import { DBManager } from '../db/dbManager';
import { RPLog } from '../entities/rpLog';
import moment = require('moment');

export const platForms: { [key: string]: string } = {
  'origin': 'origin',
  'ps': 'psn',
  'xbox': 'xbl'
}

export async function getRPLogsBetweenAsync(beginning: string, ending: string, season: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  try {
    const connection = await DBManager.getConnectedConnectionAsync();
    const repository = connection.getRepository(RPLog);
    // 期間内の記録を取得
    rpLogs = await repository.find({
      where: {
        season: season,
        date: Between(beginning + ' 00:00:00', ending + ' 23:59:59'),
      },
      order: {
        date: 'ASC'
      }
    });
  } catch (e) {
    throw e;
  } finally {
    await DBManager.closeConnectionAsync();
  }
  return rpLogs;
}

export async function getRPLogsOnSeasonAsync(season: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  try {
    const connection = await DBManager.getConnectedConnectionAsync();
    const repository = connection.getRepository(RPLog);
    // シーズン内の記録を取得
    rpLogs = await repository.find({
      where: {
        season: season
      }
    });
  } catch (e) {
    throw e;
  } finally {
    await DBManager.closeConnectionAsync();
  }
  return rpLogs;
}

async function getCurrentBorderAsync(plat: string): Promise<number> {
  let borderRp = -1;
  try {
    const border = config.env.BORDER;
    const playersPerPage = config.env.PLAYERS_PER_PAGE;
    const targetPage = Math.ceil(border / playersPerPage);
    const url = `https://tracker.gg/apex/leaderboards/stats/${plat}/RankScore?page=${targetPage}`;
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const nodes = document.querySelectorAll('td.highlight');
    const rpList = Array.from(nodes).map((td?: any) => Number(td.textContent.trim().replace(/[^0-9]/g, '')));
    if (rpList.length === playersPerPage) {
      borderRp = rpList[49];
    } else {
      throw new Error(`rpList.length = ${rpList.length} is not equals ${playersPerPage}.`);
    }
  } catch (e) {
    throw e;
  }
  return borderRp;
}

export async function getCurrentBordersAsync(): Promise<{
  date: string;
  borders: { [key: string]: number };
}> {
  const borders: { [key: string]: number } = {}
  for (const plat of Object.keys(platForms)) {
    try {
      borders[plat] = await getCurrentBorderAsync(platForms[plat]);
      process.stderr.write(`${plat}: done!\n`);
    } catch (e) {
      throw e;
    }
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

async function getRPList(plat: string): Promise<number[]> {
  const border = config.env.BORDER;
  const playersPerPage = config.env.PLAYERS_PER_PAGE;
  let rpList: number[] = [];
  try {
    const lastPage = Math.ceil(border / playersPerPage);
    for (let page = 1; page <= lastPage; page++) {
      process.stderr.write(`\r${plat}: ${page}/${lastPage} ${rpList.length}/${border}`);
      const url = `https://tracker.gg/apex/leaderboards/stats/${plat}/RankScore?page=${page}`;
      const res = await fetch(url).catch(e => { throw e });
      const html = await res.text().catch(e => { throw e });
      const dom = new JSDOM(html);
      const document = dom.window.document;
      const nodes = document.querySelectorAll('td.highlight');
      const onePage = Array.from(nodes).map((td?: any) => Number(td.textContent.trim().replace(/[^0-9]/g, '')));
      rpList = rpList.concat(onePage);
    }
    // ボーダーまで切り捨て
    rpList = rpList.slice(0, border);
    if (rpList.length !== border) {
      throw new Error(`rpList.${plat}.length = ${rpList.length} is not equals ${border}.`);
    }
    process.stderr.write(`\r${plat}: ${lastPage}/${lastPage} ${rpList.length}/${border} done!\n`);
  } catch (e) {
    throw e;
  }
  return rpList;
}

export async function getRPLists(): Promise<RPLog> {
  const rpLog = new RPLog(moment().format("YYYY-MM-DD HH:mm:ss"), config.env.SEASON);
  for (const plat of Object.keys(platForms)) {
    try {
      rpLog[plat] = await getRPList(platForms[plat]);
    } catch (e) {
      throw e;
    }
  }
  return rpLog;
}