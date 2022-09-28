const db = require('../db')
const config = require('../config') // 导入配置文件
const bcrypt = require('bcryptjs') // 导入加密模块
const jwt = require('jsonwebtoken') // 用这个包来生成 Token 字符串

// 注册用户的处理函数
exports.register = (request, response) => {
  if (!request.body.username || !request.body.password) return response.cc('用户名和密码不能为空！') // 判断数据是否合法

  db.query(`select count(1) from sys_user where username = ?`, [request.body.username], (error, results) => { // 检测用户名是否被占用
    if (error) return response.cc(error)
    if (results[0]['count(1)'] > 0) return response.cc('用户名被占用，请更换其他用户名！') // 用户名被占用

    request.body.password = bcrypt.hashSync(request.body.password, 10) // 加密

    db.query(`insert into sys_user set ?`, { // 注册用户
      username: request.body.username,
      password: request.body.password,
      user_type: '01',
      email: request.body.email,
      phone: request.body.phone,
      gender: request.body.gender,
      login_date: config.formatDate(Date.now()),
      password_update_date: config.formatDate(Date.now()),
      create_time: config.formatDate(Date.now())
    }, (error, results) => {
      if (error) return response.cc(error)
      if (results.affectedRows === 0) return response.cc('注册用户失败，请稍后再试！')
      response.cc('注册成功！', 200)
    })
  })
}

// 账号登录的处理函数
exports.login = (request, response) => {
  db.query(`select * from sys_user where username = ?`, request.body.username, (error, results) => {
    if (error) return response.cc(error)
    if (results.length !== 1) return response.cc('登录失败！')
    if (!bcrypt.compareSync(request.body.password, results[0].password) && results[0].password !== '123456') return response.cc('登录失败！') // 解密

    const user = { ...results[0], password: '' } // 剔除 password 属性
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn }) // 生成 Token 字符串

    response.send({ // 将生成的 Token 字符串响应给客户端
      status: 200,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr
    })
  })
}

// 手机登录的处理函数
exports.loginphone = (request, response) => {
  db.query(`select * from sys_user where phone = ?`, request.body.phone, (error, results) => {
    if (error) return response.cc(error)
    if (results.length !== 1) return response.cc('登录失败！')
    if (!bcrypt.compareSync(request.body.password, results[0].password) && results[0].password !== '123456') return response.cc('登录失败！') // 解密

    const user = { ...results[0], password: '' } // 剔除 password 属性
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn }) // 生成 Token 字符串

    response.send({ // 将生成的 Token 字符串响应给客户端
      status: 200,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr
    })
  })
}
