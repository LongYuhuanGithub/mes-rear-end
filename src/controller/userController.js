const db = require('../config')
const bcrypt = require('bcryptjs') // 导入加密模块
const md5 = require("md5");
const moment = require("moment"); // 用这个包来生成 Token 字符串

// 获取用户列表的处理函数
exports.getUserList = async (request, response) => {
  let sql, result

  // 如果没有传递这列参数，就把他们赋值为空字符串，不然模糊查询时会被解析成 %undefined%
  if (!request.query.username) request.query.username = ''
  if (!request.query.phone) request.query.phone = ''
  if (!request.query.status) request.query.status = ''

  // 获取总记录数
  result = await new Promise((resolve, reject) => {
    sql = `select count(1) from sys_user where is_delete = 0 and username like ? and phone like ? and status like ?`
    db.query(sql, [
      `%${request.query.username}%`,
      `%${request.query.phone}%`,
      `%${request.query.status}%`
    ], (error, results) => {
      if (error) return reject({ flag: true, error })
      resolve({ flag: false, total: results[0]['count(1)'] })
    })
  }).catch(error => error)
  if (result.flag) response.cc(result.error)

  const total = result.total // 转存 total

  // 分页查询用户列表
  result = await new Promise((resolve, reject) => {
    sql = `select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0 and username like ? and phone like ? and status like ? limit ?, ?`
    db.query(sql, [
      `%${request.query.username}%`,
      `%${request.query.phone}%`,
      `%${request.query.status}%`,
      (request.query.current - 1) * request.query.size,
      request.query.size
    ], (error, results) => {
      if (error) return reject({ flag: true, error })
      resolve({ flag: false, results })
    })
  }).catch(error => error)
  if (result.flag) response.cc(result.error)

  response.send({
    status: 200,
    message: '获取用户列表成功！',
    total,
    data: result.results
  })
}

// 按照ID获取用户的处理函数
exports.getUserById = (request, response) => {
  const sql = `select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0 and id = ?`
  db.query(sql, [request.params.id], (error, results) => {
    if (error) return response.cc(error)
    response.send({
      status: 200,
      message: '获取用户成功！',
      data: results[0]
    })
  })
}

// 添加用户的处理函数
exports.addUser = async (request, response) => {
  let sql, result

  // 校验重复
  result = await new Promise((resolve, reject) => {
    sql = `select * from sys_user where is_delete = 0 and (username = ? or email = ? or phone = ?)`
    db.query(sql, [request.body.username, request.body.email, request.body.phone], (error, results) => {
      if (error) return reject({ flag: true, error })
      if (results.length > 0) {
        if (results[0].username === request.body.username) return reject({ flag: true, error: '用户名被占用，请更换其他用户名！' })
        if (results[0].email === request.body.email) return reject({ flag: true, error: '邮箱被占用，请更换其他邮箱！' })
        if (results[0].phone === request.body.phone) return reject({ flag: true, error: '手机被占用，请更换其他手机！' })
      }

      const salt = Math.floor(Math.random() * 9000000000) + 1000000000 // 随机生成一个盐
      request.body.password = md5(md5(request.body.password + salt)) // 两次 md5 加密
      request.body.password = bcrypt.hashSync(request.body.password, 10) // bcryptjs 加密
      resolve({ flag: false, salt })
    })
  }).catch(error => error)
  if (result.flag) return response.cc(result.error)

  // 添加用户
  result = await new Promise((resolve, reject) => {
    sql = `insert into sys_user set ?`
    db.query(sql, {
      username: request.body.username,
      password: request.body.password,
      salt: result.salt,
      user_type: '00',
      email: request.body.email,
      phone: request.body.phone,
      gender: request.body.gender,
      login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      password_update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      create_by: request.body.create_by,
      create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      remark: request.body.remark
    }, (error, results) => {
      if (error) return reject({ flag: true, error })
      if (!results.affectedRows) return reject({ flag: true, error: '添加用户失败，请稍后再试！' })
      resolve({ flag: false, insertId: results.insertId })
    })
  }).catch(error => error)
  if (result.flag) return response.cc(result.error)

  // 添加用户角色关系
  const user_id = result.insertId
  for (let i = 0, length = request.body.roleIds.length; i < length; i++) {
    result = await new Promise((resolve, reject) => {
      sql = `insert into sys_user_role values(?, ?)`
      db.query(sql, [user_id, request.body.roleIds[i]], (error, results) => {
        if (error) return reject(error)
        if (!results.affectedRows) return reject('添加用户角色关系失败，请稍后再试！')
        resolve()
      })
    }).catch(error => error)
    if (result) return response.cc(result)
  }

  response.cc('添加成功！', 200)
}

// 删除用户的处理函数
exports.deleteUser = async (request, response) => {
  let sql, result

  // 将 is_delete 改成 1，表示删除
  result = await new Promise((resolve, reject) => {
    sql = `update sys_user set is_delete = 1 where id = ?`
    db.query(sql, [request.params.id], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('删除用户失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 删除用户角色关系
  result = await new Promise((resolve, reject) => {
    sql = `delete from sys_user_role where user_id = ?`
    db.query(sql, [request.params.id], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('删除用户角色关系失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  response.cc('删除成功！', 200)
}

// 修改用户的处理函数
exports.updateUser = async (request, response) => {
  let sql, result

  // 校验重复
  result = await new Promise((resolve, reject) => {
    sql = `select * from sys_user where is_delete = 0 and id != ? and (email = ? or phone = ?)`
    db.query(sql, [request.body.id, request.body.email, request.body.phone], (error, results) => {
      if (error) return reject(error)
      if (results.length > 0) {
        if (results[0].email === request.body.email) return reject('邮箱被占用，请更换其他邮箱！')
        if (results[0].phone === request.body.phone) return reject('手机被占用，请更换其他手机！')
      }
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 修改用户
  result = await new Promise((resolve, reject) => {
    sql = `update sys_user set ? where id = ?`
    db.query(sql, [{
      email: request.body.email,
      phone: request.body.phone,
      gender: request.body.gender,
      remark: request.body.remark
    }, request.body.id], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('修改用户失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 删除用户角色关系
  result = await new Promise((resolve, reject) => {
    sql = `delete from sys_user_role where user_id = ?`
    db.query(sql, [request.body.id], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('修改用户角色关系失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 添加用户角色关系
  for (let i = 0, length = request.body.roleIds.length; i < length; i++) {
    result = await new Promise((resolve, reject) => {
      sql = `insert into sys_user_role values(?, ?)`
      db.query(sql, [request.body.id, request.body.roleIds[i]], (error, results) => {
        if (error) return reject(error)
        if (!results.affectedRows) return reject('修改用户角色关系失败，请稍后再试！')
        resolve()
      })
    }).catch(error => error)
    if (result) return response.cc(result)
  }
  response.cc('修改成功！', 200)
}
