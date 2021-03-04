import * as express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('<h1 style="text-align:center">ApexBorderAPIServer<h1>');
});

export default router;