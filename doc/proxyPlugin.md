http-proxy 和 http-proxy-middleware 区别
http-proxy 是老板本，http-proxy-middleware 是基于它上面更新的。前者已经不更新，后者持续更新
使用：前端请求可能是 /api/user/login;

http-proxy
```
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  target: targetUrl   // targetUrl是要指向的服务器地址，
});

app.use('/api', (req,res) => {
  proxy.web(req,res,{target:targetUrl})； // 把/api 替换成服务器路径
});
```
http-proxy-middleware  //简洁

```
import proxy from 'http-proxy-middleware';

app.use('/api', proxy({target: targetUrl})); //  这里的配置项比较丰富

```

express的 use
Express是一个路由和中间件Web框架