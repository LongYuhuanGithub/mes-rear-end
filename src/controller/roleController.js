const db = require('../config')

// 获取用户列表的处理函数
exports.getRoleList = async (request, response) => {
  // 如果没有传递这列参数，就把他们赋值为空字符串，不然模糊查询时会被解析成 %undefined%
  if (!request.query.role_name) request.query.role_name = ''

  // 查询角色列表
  const sql = `select id, role_name, sort, status, create_by, create_time, remark from sys_role where is_delete = 0 and role_name like ?`
  db.query(sql, [`%${request.query.role_name}%`], (error, results) => {
    if (error) return response.cc(error)

    response.send({
      status: 200,
      message: '获取角色列表成功！',
      data: results
    })
  })
}
