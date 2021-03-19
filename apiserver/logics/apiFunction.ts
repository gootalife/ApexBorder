/* eslint no-useless-catch: 0 */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Between, Connection, In } from 'typeorm';
import config from '../config.json';
import { DBManager } from '../db/dbManager';
import { Border } from '../entities/border';
import { RPLog } from '../entities/rpLog';

axiosRetry(axios, { retries: 10 });

export async function getRPLogsBetweenAsync(beginning: string, ending: string): Promise<RPLog[]> {
  let rpLogs: RPLog[] = [];
  let connection: Connection;
  try {
    connection = await DBManager.getConnectionAsync();
    const repository = connection.getRepository(RPLog);
    // 期間内の記録を取得
    rpLogs = await repository.find({
      where: {
        date: Between(beginning + ' 00:00:00', ending + ' 23:59:59')
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

export async function getCurrentBordersAsync(): Promise<Border[]> {
  let borders: Border[] = [];
  let connection: Connection;
  try {
    connection = await DBManager.getConnectionAsync();
    const repository = connection.getRepository(Border);
    // 現在のボーダーを取得
    borders = await repository.find({
      where: {
        platform: In(Object.keys(config.platforms))
      }
    });
  } catch (e) {
    throw e;
  } finally {
    await connection.close();
  }
  return borders;
}