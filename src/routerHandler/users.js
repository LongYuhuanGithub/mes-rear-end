const db = require('../db')
const config = require('../config') // 导入配置文件
const bcrypt = require('bcryptjs') // 导入加密模块
const jwt = require('jsonwebtoken') // 用这个包来生成 Token 字符串

// 获取用户列表的处理函数
exports.getUserList = (request, response) => {
  db.query(
    `select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0`,
    (error, results) => {
      if (error) return response.cc(error)
      response.send({
        status: 200,
        message: '获取用户列表成功！',
        data: results
      })
    }
  )
}

// 按照ID获取用户的处理函数
exports.getUserById = (request, response) => {
  db.query(
    `select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0 and id = ?`,
    [request.params.id],
    (error, results) => {
      if (error) return response.cc(error)
      response.send({
        status: 200,
        message: '获取用户成功！',
        data: results[0]
      })
    }
  )
}

exports.addUser = (request, response) => {
  console.log(request, response)
}

exports.deleteUser = (request, response) => {
  console.log(request, response)
}

exports.updateUser = (request, response) => {
  console.log(request, response)
}
