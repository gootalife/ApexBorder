/* eslint no-useless-catch: 0 */
import moment from 'moment';
import { Between, Connection } from 'typeorm';
import config from '../config.json';
import { DBManager } from '../db/dbManager';
import { RPLog } from '../entities/rpLog';
const puppeteer = require('puppeteer');

export async function getRPLogsBetweenAsync(beginning: string, ending: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  let connection: Connection;
  try {
    connection = await DBManager.getConnectionAsync();
    const repository = connection.getRepository(RPLog);
    // 期間内の記録を取得
    rpLogs = await repository.find({
      where: {
        date: Between(beginning + ' 00:00:00', ending + ' 23:59:59'),
      },
      order: {
        date: 'ASC'
      }
    });
  } catch (e) {
    throw e;
  } finally {
    await connection.close();
  }
  return rpLogs;
}

export async function getRPLogsOnSeasonAsync(season: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  let connection: Connection;
  try {
    connection = await DBManager.getConnectionAsync();
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
    await connection.close();
  }
  return rpLogs;
}

async function getCurrentBorderAsync(plat: string): Promise<number> {
  let borderRp = -1;
  let browser;
  let window;
  try {
    const border = config.env.border;
    const playersPerPage = config.env.playersPerPage;
    const targetPage = Math.ceil(border / playersPerPage);
    const url = `https://tracker.gg/apex/leaderboards/stats/${plat}/RankScore?page=${targetPage}`;
    browser = await puppeteer.launch();
    const window = await browser.newPage();
    await window.goto(url, {
      timeout: 0
    });
    await window.waitForSelector('td.stat.highlight');
    const ranking = await window.evaluate(() => {
      const result: string[] = [];
      document.querySelectorAll('td.stat.highlight').forEach(elem => {
        result.push(elem.textContent.trim().replace(',', ''));
      });
      return result;
    });
    if (ranking.length === playersPerPage) {
      borderRp = ranking[49];
    } else {
      throw new Error(`rpList.length = ${ranking.length} is not equals ${playersPerPage}.`);
    }
  } catch (e) {
    throw e;
  } finally {
    if (window) {
      await window.close();
    }
    if (browser) {
      await browser.close();
    }
  }
  return borderRp;
}

export async function getCurrentBordersAsync(): Promise<{
  date: string;
  borders: { [key: string]: number };
}> {
  const borders: { [key: string]: number } = {}
  for (const plat of Object.keys(config.platforms)) {
    try {
      borders[plat] = await getCurrentBorderAsync(config.platforms[plat]);
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

async function getCurrentRPRankingAsync(plat: string): Promise<number[]> {
  const border = config.env.border;
  const playersPerPage = config.env.playersPerPage;
  let rpRanking: number[] = [];
  let browser;
  let window;
  try {
    const lastPage = Math.ceil(border / playersPerPage);
    browser = await puppeteer.launch();
    window = await browser.newPage();
    for (let page = 1; page <= lastPage; page++) {
      process.stderr.write(`\r${plat}: ${page}/${lastPage} ${rpRanking.length}/${border}`);
      const url = `https://tracker.gg/apex/leaderboards/stats/${plat}/RankScore?page=${page}`;
      await window.goto(url, {
        timeout: 0
      });
      await window.waitForSelector('td.stat.highlight');
      const ranking = await window.evaluate(() => {
        const result: string[] = [];
        document.querySelectorAll('td.stat.highlight').forEach(elem => {
          result.push(elem.textContent.trim().replace(',', ''));
        });
        return result;
      });
      rpRanking = rpRanking.concat(ranking);
    }
    // ボーダーまで切り捨て
    rpRanking = rpRanking.slice(0, border);
    if (rpRanking.length !== border) {
      throw new Error(`rpList.${plat}.length = ${rpRanking.length} is not equals ${border}.`);
    }
    process.stderr.write(`\r${plat}: ${lastPage}/${lastPage} ${rpRanking.length}/${border} done!\n`);
  } catch (e) {
    throw e;
  } finally {
    if (window) {
      await window.close();
    }
    if (browser) {
      await browser.close();
    }
  }
  return rpRanking;
}

export async function getCurrentRPRankingsAsync(): Promise<RPLog> {
  const rpLog = new RPLog(moment().format("YYYY-MM-DD HH:mm:ss"), config.env.season);
  for (const plat of Object.keys(config.platforms)) {
    try {
      rpLog[plat] = await getCurrentRPRankingAsync(config.platforms[plat]);
    } catch (e) {
      throw e;
    }
  }
  return rpLog;
}