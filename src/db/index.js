const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'bB4{gD5$',
  database: 'mes_rear_end',
})

module.exports = db
