import * as express from 'express';
declare module 'apiFunc' {
    export const platForms: { [key: string]: string }
    export function getRPLogsAsync(req: express.Request): Promise<RPLog[]>


}