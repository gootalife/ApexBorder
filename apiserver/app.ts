import express from 'express';
import 'reflect-metadata';
import config from './config.json';
import api from './routes/v1/api';
import index from './routes/index';

const app = express();

app.use('/', index);
app.use('/api/v1', api);

// body-parserに基づいた着信リクエストの解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORSの許可
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.set('port', config.env.port || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});