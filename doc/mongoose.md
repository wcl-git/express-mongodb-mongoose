## mongoose 四步连接操作数据库 mongodb

1、服务器连接数据库
mongoose.connect('数据库地址', (err) => {
  这里面如果 err存在，什么也不做，
  不存在，则：
  app.listen(port, (err) => {  // 这里是启动后台服务器，也就是连接数据库的回调里面监听服务器

  })
})


2、 定义数据库集合的数据类型，这个一般对应一个接口，schemas,实例代码 /schemas/users
```
import mongoose from 'mongoose';
const userSchema =  new mongoose.Schema({
    username:String,
    password:String,
    type:String//管理员、普通用户
});

export default userSchema;
```


3、创建对应 schemas 的model
```
import mongoose from 'mongoose'
import userSchema from '../schemas/users'
const  User = mongoose.model("User",userSchema);

export default User;
```
mongoose是通过model来创建mongodb中对应的集合（collection）
这里有一个隐形问题，model的名字在对应的数据库里的集合，默认会在末尾加一个s，这个问题要注意!这个问题要注意!这个问题要注意!。
无论名字首字母大小写，数据库都将集合名字全部小写
例如：
```
mongoose.model("User",userSchema);
在robo3t可视化下你看到的是 users
```




4、接口和数据库集合一一对应，也就是增删改查
```
import User from '../../models/user'  // 引入定义的集合
const responseClient = (res, httpCode=500, code=3, message='服务端异常', data={}) {
  let responseData = {};
  responseData.code = code;
  responseData.message = message;
  responseData.data = data;
  res.status(httpCode).json(responseData)  // 这里的status 和 json 都是express 方法，作用是把数据以json格式返回给前端。
}

// 注册接口，返回用户数据
router.post('/register', (req,res) => {
  let { userName, password, passwordRe } = req.body; // 这是数据
  
  // new 一个model为 user，参数是传如数据库的数据
  let user = new User({
    username: userName,
    password: md5(password + MD5_SUFFIX),
    type: 'user'
  });

  user.save()  // 把数据保存到数据库中
    .then(() => {
      User.findOne({username: userName})  // 这里逻辑是查询数据库数据并
        .then(userInfo => {
          let data = {};
          data.username = userInfo.username;
          data.userType = userInfo.type;
          data.userId = userInfo._id;
          responseClient(res, 200, 0, '注册成功', data);  // 数据以json格式返回给前端
        });
    })      
});
```
