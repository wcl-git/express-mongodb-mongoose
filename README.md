# express-mongodb-mongoose
express-mongodb-mongoose 后台服务项目
从零开始搭建后台服务器
项目目录大致如下：

```
.
├── README.md                   //项目说明文件
├── config                      
│   └── config.js               //总应用配置文件
├── models                     //存放mongoose model文件夹
│   └── user.js                 //存放user model文件
├── package.json
├── schemas                     //mongoose schema文件夹
│   └── users.js
├── server                      // server端源码文件夹
│   ├── api                     //server端 api接口文件夹
│   └── util.js                 //server端工具类文件
├── static                      //静态资源托管文件夹
│   └── favicon.ico
├── webpack.dev.js              //开发环境下webpack配置文件
└── webpack.prod.js             //生产环境下webpack配置文件
```
