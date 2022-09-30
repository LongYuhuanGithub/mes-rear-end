const db = require('../config')

// 获取菜单列表的处理函数
exports.getMenuList = (request, response) => {
  const sql = `select * from sys_menu`
  db.query(sql, (error, results) => {
    if (error) return response.cc(error)
    response.send({
      status: 200,
      message: '获取菜单列表成功！',
      data: results
    })
  })
}
