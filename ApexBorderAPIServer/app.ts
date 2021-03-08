import * as express from 'express';
import index from './routes/index';
import api from './routes/api';
import 'reflect-metadata';

const app = express();

app.use('/', index);
app.use('/api', api);

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});