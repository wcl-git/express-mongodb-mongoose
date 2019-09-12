/**
 * api请求server
 *
 * 0：成功
 * 1：数据不合法
 * 2：客户端数据错误
 * 3：后端错误
 */

import Express from 'express'
import config from '../../config/config'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'


const port = config.apiPort;

const app = new Express();
// app.use(bodyParser.urlencoded({extended: false}));   // 解析 application/x-www-form-urlencoded, 这个参数和值都要encodeURIComponent

app.use(bodyParser.json());  // 解析 application/json
app.use(cookieParser('express_react_cookie'));
app.use(session({
    secret:'express_react_cookie',
    resave: true,
    saveUninitialized:true,
    cookie: {maxAge: 60 * 1000 * 30}//过期时间
}));

// 登录注册页面路由
app.use('/user', require('./user'));

mongoose.Promise = require('bluebird');
mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/blog`, function (err) {
    if (err) {
        console.log(err, "数据库连接失败");
        return;
    }
    console.info(`===> db server is running at ${config.dbHost}:${config.dbPort}`)

    app.listen(port, function (err) {
        if (err) {
            console.error('err:', err);
        } else {
            console.info(`===> api server is running at ${config.apiHost}:${config.apiPort}`)
        }
    });
});
