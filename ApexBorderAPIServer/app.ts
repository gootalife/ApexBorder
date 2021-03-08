import express from 'express';
import 'reflect-metadata';
import config from './config.json';
import api from './routes/api';
import index from './routes/index';

const app = express();

app.use('/', index);
app.use('/api', api);

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('port', config.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});