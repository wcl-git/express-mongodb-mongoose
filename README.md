# express-mongodb-mongoose
express-mongodb-mongoose 后台服务项目， 给前端提供接口和数据库操作， 看着顺眼的朋友，start一下哦。谢谢
作为前端人员，学习 nodejs 是必须要懂的。然而，教程都是前后台集中在一起，
本项目是自己抽离出来的项目，专门给前端提供接口和数据库操作。并没有大多 express 教程，搞一堆模版

从零开始搭建后台服务器, 接口暂时写 user.js 两个接口，如果添加更多接口按 user.js 方式添加就好
项目实现一些关键，了解1、2 这些关键，往下看才会轻松
### 1、安装 mongodb 数据库，并安装 robo3t 可视化界面操作数据库。 选择 robo3t，因为它免费。安装及使用教程 请看 doc 下面的 mongodb.md 文档
### 2、 mongoose 把接口和数据库连接起来，教程文档 在 doc 下面的mongoose.md
### 3、初始化项目及代码实现

项目目录大致如下：

```
.
├── README.md                   //项目说明文件
├── config                      
│   └── config.js               //总应用配置文件
├── doc                         //文档
│   └── mongodb.md             // mongodb教程等
├── models                     //存放mongoose model文件夹
│   └── user.js                 //存放user model文件
├── package.json
├── schemas                     //mongoose schema文件夹
│   └── users.js
├── server                      // server端源码文件夹
│   ├── api                     //server端 api接口文件夹
│   └── util.js                 //server端工具类文件
```

首先 全局nodejs安装，git安装，这些就不用提了，前端人员，这个是基础。
（1）、初始化项目
有两种方式，一种是在git仓库创建一个，clone下来，然后 npm init
另一种是直接在本地 npm init, 之后在git init ,对应远程git仓库。
相应目录下 npm init  一路回车即可。

（2）、安装必要的依赖
按package.json 里的依赖
很多依赖都是balbelnpm包，如果我门写es6、7、8 代码风格就要这些包
你可以尝试一个一个的安装，根居报错来安装，你需要在根目录建 .babelrc文件，把babel 的preset和插件放入里面。
本教程使用的是babel.7x。
除了babel依赖，剩下的就是 express 依赖，重要说明几个依赖
bluebird： 用这个包是 mongoose 能像 promise 一样执行then之后的方法，这是目前很好用的包
nodemon： Node自动重启工具，作为接口数据服务，一定要能自己自动重启
mongoose：用来操作mongodb数据库哦，是接口和数据库连接的纽带


（3）创建目录  
  可以手动创建，也可以命令行创建，我个人偏向与命令行创建，毕竟手动创建有点low
  mkdir config   
  mkdir doc
  mkdir models
  mkdir schemas
  mkdir server
  touch .babelrc
  touch .gitignore
  
  目录创建完毕
  在config目录下创建 config.js 
  添加下面代码,这些是前端后端数据库一些端口配置，可以按自己需求修改
  ```
  module.exports = {
    host:process.env.HOST || 'localhost', // 前端
    port:process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 3000), // 前端
    apiHost:process.env.APIHOST || '127.0.0.1', // 接口
    apiPort:process.env.APIPORT || '3030',  // 接口
    dbHost:'localhost',  // 数据库
    dbPort:'27017',  // 数据库
  };
  ```
在 server 目录下新建 util.js 和api文件夹
utils.js 作用是把发送给前端的数据格式抽出来的一个公共方法，以及一些md5的添加，
```utils.js
import crypto from 'crypto'
/* 
 *这里完全可以用es6 export default 的由于习惯也就没有改了，
 *下面函数完全可以箭头函数代替，因为我门已经安装了 transform-class-properties 等babel插件
*/
module.exports = {
  MD5_SUFFIX: 'eiowafnajkdlfjsdkfj大姐夫文姐到了困难额我积分那看到你@#￥%……&）（*&……）',
  md5: function (pwd) {
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex')
  },
  responseClient: function (res,httpCode = 500, code = 3,message='服务端异常',data={}) {
    let responseData = {};
    responseData.code = code;
    responseData.message = message;
    responseData.data = data;
    res.status(httpCode).json(responseData)  // 这段代码的作用就是添加http状态，并把数据以json格式返回给前端，可以查 status, json 都是 express 的方法 如果困惑可以看文档
  }
}
```
在api文件夹下
新建一个 apiServer.js 这个是所有接口汇聚的文件

```apiServer.js
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

// 登录注册路由，也就是前缀是 /user 的接口
// 这里是登录页面所有接口的引入，例如 user.js 里面接口 /login，这传给前端接口是 /user/login
// 也就是在原来的路由前面在加上下面定义的前缀
// 多个页面也按这个方式引入，接口细节逻辑在各自文件中
app.use('/user', require('./user')); 

mongoose.Promise = require('bluebird'); // 使mongoose具有异步操作
// 下面是连接数据库
//  注意！注意！注意！ 地址后面的 blog 它表示存储数据的集合名称，你启动数据库时候，别忘记要创建一个数据集 create database
// 不然，你会发现，你数据可视化找不到你存储的数据
mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/blog`, function (err) {
  if (err) {
    console.log(err, "数据库连接失败");
    return;
  }
  console.info(`===> db server is running at ${config.dbHost}:${config.dbPort}`)
  // 监听 服务器接口端
  app.listen(port, function (err) {
    if (err) {
      console.error('err:', err);
    } else {
      console.info(`===> api server is running at ${config.apiHost}:${config.apiPort}`)
    }
  });
});
```
新建一个 index.js 这是用babel处理 apiServer.js 后并export这个模块
```index.js
require('@babel/register');
require('./apiServer');
````

新建 user.js, 这里的逻辑就是接口和数据口的逻辑，/login,  /register, /userInfo, /logout 四个接口
这里只是示例，建议先看一下mongoose.md 的教程，看完就应该明白mongoose运行逻辑，
下面的如，findOne方法是mongodb数据库的操作，看一看一下mongodb的文档
```user.js
import Express from 'express'
const router = Express.Router();
import User from '../../models/user'
import {MD5_SUFFIX,responseClient,md5} from '../util'

router.post('/login', (req, res) => {
    let {username, password} = req.body;
    if (!username) {
        responseClient(res, 400, 2, '用户名不可为空');
        return;
    }
    if (!password) {
        responseClient(res, 400, 2, '密码不可为空');
        return;
    }
    User.findOne({  // 在数据库中查找
        username,
        password: md5(password + MD5_SUFFIX)
    }).then(userInfo => {
        if (userInfo) {
            //登录成功
            let data = {};
            data.username = userInfo.username;
            data.userType = userInfo.type;
            data.userId = userInfo._id;
            //登录成功后设置session
            req.session.userInfo = data;

            responseClient(res, 200, 0, '登录成功', data);  // 把数据返回给前端
            return;
        }
        responseClient(res, 400, 1, '用户名密码错误');

    }).catch(err => {
        responseClient(res);
    })
});


router.post('/register', (req, res) => {
    let {userName, password, passwordRe} = req.body;
    if (!userName) {
        responseClient(res, 400, 2, '用户名不可为空');
        return;
    }
    if (!password) {
        responseClient(res, 400, 2, '密码不可为空');
        return;
    }
  
    //验证用户是否已经在数据库中
    User.findOne({username: userName})
      .then(data => {
        if (data) {
          responseClient(res, 200, 1, '用户名已存在');
          return;
        }
        //保存到数据库
        let user = new User({
          username: userName,
          password: md5(password + MD5_SUFFIX),
          type: 'user'
        });
        user.save()
          .then(function () {
            User.findOne({username: userName})
              .then(userInfo=>{
                let data = {};
                data.username = userInfo.username;
                data.userType = userInfo.type;
                data.userId = userInfo._id;
                responseClient(res, 200, 0, '注册成功', data);
                return;
              });
          })
      }).catch(err => {
      responseClient(res);
      return;
    });
});

//用户验证
router.get('/userInfo',function (req,res) {
    if(req.session.userInfo){
        responseClient(res,200,0,'',req.session.userInfo)
    }else{
        responseClient(res,200,1,'请重新登录',req.session.userInfo)
    }
});

router.get('/logout',function (req,res) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
```

在 schemas 下面建 users.js ,这里的作用是设置登录信息的数据结构
```

// 用户的表结构
import mongoose from 'mongoose'

// module.exports = new mongoose.Schema({
//     username:String,
//     password:String,
//     type:String//管理员、普通用户
// });

const userSchema =  new mongoose.Schema({
    username:String,
    password:String,
    type:String//管理员、普通用户
});

export default userSchema;
```

在 models 新建 user.js  这里是创建数据库集合
```
import mongoose from 'mongoose'
import userSchema from '../schemas/users'

// module.exports = mongoose.model("User",userSchema);
const  User = mongoose.model("User",userSchema);

export default User;
```

现在
npm install  安装完毕
npm start 
 一个服务器就启动了， 正常情况下，是启动成功的，如果启动不成功，
 首先检查一下数据库是否启动，如果没启动，先启动数据库，就应该没啥问题了。
 如果是代码错误，一般都是babel依赖缺少，找到对应安装就好。

 下面启动服务器的顺序

 #### 启动数据库
 #### 启动项目
 #### 打开数据可视化 robo3t 创建连接数据库那段代码定义的 数据集名称， 如果已有就不用建了
 #### 发送请求，验证是否成功



测试一下接口，可以用 postman  将接口地址复制进 postman，就可以验证请求接口了，
注意：这里有一个坑，post 接口时候 要设置headers的 Content-Type: application/json, 不然拿不到req.body的数据
如果请求成功,假如你用的是注册接口，成功之后，你查看一下数据库，就多一条数据了，
这样从前端把数据传给后台在存入数据库这个流程就完成了。是不是很有成就感。
多几个页面，无非就是对几个接口文件，和数据 model。接口路由和前端页面路由相似，好理解。

### 还有也个问题，前端项目怎么设置才会访问这个项目的接口呢？
其实简单，之前 config.js里面已经有前端端口的设置，把端口和你启动的项目端口对应， 假定 以 /api 开头
有两个npm 包  http-proxy-middleware 和 http-proxy。两个没蛇么区别， http-proxy-middleware是基于 http-proxy优化的。用那也个都行
如果你使用的是 webpack 的 devServer 则不用上面的包，
直接配置 devServer 的 proxy
```
proxy: {
  '/api': {
    target: 'http://localhost:3030',  // 因为我启动的后台是3030端口，请看config.js里面配置
  }
}
```

如果是 express 启动的话，以 http-proxy 为例
```
import httpProxy from 'http-proxy';
const targetUrl = `http://${config.apiHost}:${config.apiPort}`; // 这里替换成自己的路径
const proxy = httpProxy.createProxyServer({
  target:targetUrl
});

app.use('/api', (req,res) => {
    proxy.web(req,res,{target:targetUrl})
});

```
按上面两种方式就打通前后台真个流程。
http-proxy 和 http-proxy-middleware 区别 请看 doc下面的 proxyPlugin.md

欢迎提 issue


