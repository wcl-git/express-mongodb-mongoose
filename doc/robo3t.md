一个mongodb数据库集合，默认 connection Function Users.  数据一般存在connection里面

查询数据
db.getCollection('集合名').find({}) // 查询所有
db.getCollection('集合名').find({name: xxx}) // 查询name为 xxx的数据