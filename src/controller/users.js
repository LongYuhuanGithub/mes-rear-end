const db = require('../config')
const config = require('../utils/config') // 导入配置文件
const bcrypt = require('bcryptjs') // 导入加密模块
const jwt = require('jsonwebtoken')
const md5 = require("md5");
const moment = require("moment"); // 用这个包来生成 Token 字符串

// 获取用户列表的处理函数
exports.getUserList = (request, response) => {
  const sql = `select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0`
  db.query(sql, (error, results) => {
    if (error) return response.cc(error)
    response.send({
      status: 200,
      message: '获取用户列表成功！',
      data: results
    })
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
exports.addUser = (request, response) => {
  let sql = `select count(1) from sys_user where is_delete = 0 and username = ?`
  db.query(sql, [request.body.username], (error, results) => { // 检测用户名是否被占用
    if (error) return response.cc(error)
    if (results[0]['count(1)'] > 0) return response.cc('用户名被占用，请更换其他用户名！') // 用户名被占用

    const salt = Math.floor(Math.random() * 9000000000) + 1000000000 // 随机生成一个盐
    request.body.password = md5(md5(request.body.password + salt)) // 两次 md5 加密
    request.body.password = bcrypt.hashSync(request.body.password, 10) // bcryptjs 加密

    sql = `insert into sys_user set ?`
    db.query(sql, { // 添加用户
      username: request.body.username,
      password: request.body.password,
      salt,
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
      if (error) return response.cc(error)
      if (!results.affectedRows) return response.cc('添加用户失败，请稍后再试！')

      // 添加用户角色关系
      sql = `insert into sys_user_role values(?, ?)`
      db.query(sql, [results.insertId, request.body.role_id], (error, results) => {
        if (error) return response.cc(error)
        if (!results.affectedRows) return response.cc('添加用户角色关系失败，请稍后再试！')
        response.cc('添加成功！', 200)
      })
    })
  })
}

// 删除用户的处理函数
exports.deleteUser = (request, response) => {
  const sql = `update sys_user set is_delete = ? where id = ?`
  db.query(sql, [1, request.params.id], (error, results) => { // 将 is_delete 改成 1 表示删除
    if (error) return response.cc(error)
    if (!results.affectedRows) return response.cc('删除用户失败，请稍后再试！')
    response.cc('删除成功！', 200)
  })
}

// 修改用户的处理函数
exports.updateUser = (request, response) => {
  console.log(request, response)
}
