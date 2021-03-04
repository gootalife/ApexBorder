import * as express from 'express';
import * as path from 'path';
import index from './routes/index';
import api from './routes/api';
import "reflect-metadata";
import DBManager from './db/dbManager';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

// CORSの許可
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

(async () => {
    await DBManager.createConnection().catch(err => console.log(err));
})();

const server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port);
});