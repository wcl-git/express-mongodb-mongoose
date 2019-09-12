mongodb  mac 上的安装

1、 下载monggo的压缩包。解压 放到某一个位置， 我习惯放在 /usr/local里面
  怎样打开 /usr/local这个目录：点开访达，command + shift + g,输入 /usr/local,前往，然后把解压后的mongodb文件夹整个放到local 里面。
2、 打开终端， 输入： open -e .bash_profile ,这时候会打开 .bash_profile这个文件，往文件中加入
  export PATH=${PATH}:/usr/local/MongoDB/bin
  conmmand + s 保存，就可以关掉文件，
  解释一下：/usr/local/MongoDB/bin 这个是你mongodb文件存放的位置，我放在 /usr/local里面，并且把mongodb文件更名为 MongoDB,
3、 在命令行中 输入： source .bash_profile  这个命令是 使刚才加入的路径生效。

4、 在命令行： mongod -version   此时应该能看到版本了，如果看不到，上面步奏没处理好。

5、 在MongoDB文件夹里增加一个 data 文件夹， log文件，

6、 执行命令： mongod --dbpath data --logpath log/mongod.log --logappend --fork

  解释： 上面命令意思是 指定数据文件路径，日志文件路径，日志以追加方式打开文件， --fork：将数据库服务放在后台运行 

7、 可视化工具： studio3t 或者 robo 3t

8、停止mongodb
   输入: mongo  回车   // 这是进入mongodb
    输入： use admin 回车，
    输入： db.shutdownServer()  回车


当下次启动mongo失败的时候，处理： 进入mongodb文件存储数据的目录，我的是 data ，删除mongod.lock.
在bin目录下重新 配置一下data路径， 我的是： mongod --dbpath ../data

这里有一个弊端，每次开机都要手动启动，你可以配置开机自动启动，这里就不讲这个话题
找到bin目录下 执行 mongod --dbpath ../data 来启动。