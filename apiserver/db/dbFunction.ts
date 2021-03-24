/* eslint no-useless-catch: 0 */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import puppeteer from 'puppeteer';
import config from '../config.json';
import { Border } from '../entities/border';
import { RPLog } from '../entities/rpLog';

async function fetchBorderAsync(plat: string): Promise<number> {
  let borderRp = -1;
  let browser;
  let window;
  try {
    const targetPage = Math.ceil(config.env.border / config.env.playersPerPage);
    const url = `https://apex.tracker.gg/legacy/leaderboards/${plat}/RankScore?page=${targetPage}`;
    browser = await puppeteer.launch();
    window = await browser.newPage();
    await window.goto(url, {
      timeout: 60000
    });
    await window.waitForSelector('td.trn-lb-entry__stat.trn-text--right');
    const ranking: string = await window.evaluate(() => {
      const result: string[] = [];
      document.querySelectorAll('td.trn-lb-entry__stat.trn-text--right').forEach((elem, index) => {
        if (index % 2 === 0) {
          result.push(elem.textContent);
        }
      });
      return result;
    });
    if (ranking.length === config.env.playersPerPage) {
      borderRp = Number(ranking[49].trim().replace(',', ''));
      process.stderr.write(`${plat}: done!\n`);
    } else {
      throw new Error(`Request to ${url} failed.`);
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

export async function fetchBordersAsync(): Promise<Border[]> {
  const borders: Border[] = [];
  const promises: Promise<number>[] = [];
  try {
    for (const plat of Object.keys(config.platforms)) {
      promises.push(fetchBorderAsync(config.platforms[plat]));
    }
    const res = await Promise.all(promises);
    for (const [index, plat] of Object.keys(config.platforms).entries()) {
      const border = new Border(plat, moment().format('YYYY-MM-DD HH:mm:ss'), res[index]);
      borders.push(border);
    }
  } catch (e) {
    throw e;
  }
  return borders;
}

async function fetchCurrentRPRankingAsync(plat: string): Promise<number[]> {
  const border = config.env.border;
  const playersPerPage = config.env.playersPerPage;
  let rpRanking: number[] = [];
  const count = Math.ceil(border / playersPerPage);
  let browser;
  let window;
  try {
    browser = await puppeteer.launch();
    window = await browser.newPage();
    for (let pageNum = 1; pageNum <= count; pageNum++) {
      process.stderr.write(`\r${plat}: ${pageNum}/${count} ${rpRanking.length}/${border}`);
      const url = `https://apex.tracker.gg/legacy/leaderboards/${plat}/RankScore?page=${pageNum}`;
      await window.goto(url, {
        timeout: 60000
      });
      await window.waitForSelector('td.trn-lb-entry__stat.trn-text--right');
      const ranking: number[] = await window.evaluate(() => {
        const result: number[] = [];
        document.querySelectorAll('td.trn-lb-entry__stat.trn-text--right').forEach((elem, index) => {
          if (index % 2 === 0) {
            result.push(Number(elem.textContent.trim().replace(',', '')));
          }
        });
        return result;
      });
      if (ranking.length !== playersPerPage) {
        throw new Error(`items.length(${ranking.length}) != ${playersPerPage}.`);
      }
      rpRanking = rpRanking.concat(ranking);
    }
    rpRanking = rpRanking.slice(0, border);
    process.stderr.write(`\r${plat}: ${count}/${count} ${rpRanking.length}/${border} done!\n`);
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

export async function fetchCurrentRPRankingsAsync(): Promise<RPLog> {
  axiosRetry(axios, { retries: 10, retryDelay: () => { return 1000; } });
  const rpLog = new RPLog(moment().format('YYYY-MM-DD HH:mm:ss'), config.env.season);
  const promises: Promise<number[]>[] = [];
  try {
    for (const plat of Object.keys(config.platforms)) {
      promises.push(fetchCurrentRPRankingAsync(config.platforms[plat]));
    }
    const results = await Promise.all(promises);
    for (const [index, plat] of Object.keys(config.platforms).entries()) {
      rpLog[plat] = results[index];
    }
  } catch (e) {
    throw e;
  }
  return rpLog;
}