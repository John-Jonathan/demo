const mysql = require('mysql2/promise')
const Genid = require('../utils/SnowFlake')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '131452',
  database: 'myselfblog',
})

// 将我们的雪花id定义在数据库文件中 雪花id将随着导入数据库文件而导入 省去再次导入雪花id
const genid = new Genid({ WorkerId: 1 })

module.exports = {
  genid,
  db,
}
