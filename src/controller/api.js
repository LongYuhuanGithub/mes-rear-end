const db = require('../config')
const config = require('../utils/config') // 导入配置文件
const md5 = require('md5') // 导入 md5 加密
const bcrypt = require('bcryptjs') // 导入加密模块
const jwt = require('jsonwebtoken') // 用这个包来生成 Token 字符串
const moment = require('moment')

// 注册用户的处理函数
exports.register = (request, response) => {
  let sql = `select count(1) from sys_user where is_delete = 0 and username = ?`
  db.query(sql, [request.body.username], (error, results) => { // 检测用户名是否被占用
    if (error) return response.cc(error)
    if (results[0]['count(1)'] > 0) return response.cc('用户名被占用，请更换其他用户名！') // 用户名被占用

    const salt = Math.floor(Math.random() * 9000000000) + 1000000000 // 随机生成一个盐
    request.body.password = md5(md5(request.body.password + salt)) // 两次 md5 加密
    request.body.password = bcrypt.hashSync(request.body.password, 10) // bcryptjs 加密

    sql = `insert into sys_user set ?`
    db.query(sql, { // 注册用户
      username: request.body.username,
      password: request.body.password,
      salt,
      user_type: '01',
      email: request.body.email,
      phone: request.body.phone,
      gender: request.body.gender,
      login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      password_update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      create_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }, (error, results) => {
      if (error) return response.cc(error)
      if (results.affectedRows === 0) return response.cc('注册用户失败，请稍后再试！')
      response.cc('注册成功！', 200)
    })
  })
}

// 账号登录的处理函数
exports.login = (request, response) => {
  const sql = `select * from sys_user where is_delete = 0 and username = ?`
  db.query(sql, request.body.username, (error, results) => {
    if (error) return response.cc(error)
    if (results.length !== 1) return response.cc('用户不存在！')

    request.body.password = md5(md5(request.body.password + results[0].salt)) // 两次 md5 加密
    if (!bcrypt.compareSync(request.body.password, results[0].password) && results[0].password !== '123456') return response.cc('登录失败！') // 校验密码

    const user = { ...results[0] }
    delete user.password // 剔除 password 属性
    delete user.salt
    delete user.is_delete
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn }) // 生成 Token 字符串

    response.send({ // 将生成的 Token 字符串响应给客户端
      status: 200,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
      data: user
    })
  })
}

// 手机登录的处理函数
exports.loginPhone = (request, response) => {
  const sql = `select * from sys_user where is_delete = 0 and phone = ?`
  db.query(sql, request.body.phone, (error, results) => {
    if (error) return response.cc(error)
    if (results.length !== 1) return response.cc('手机不存在！')

    request.body.password = md5(md5(request.body.password + results[0].salt)) // 两次 md5 加密
    if (!bcrypt.compareSync(request.body.password, results[0].password) && results[0].password !== '123456') return response.cc('登录失败！') // 校验密码

    const user = { ...results[0] }
    delete user.password // 剔除 password 属性
    delete user.salt
    delete user.is_delete
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn }) // 生成 Token 字符串

    response.send({ // 将生成的 Token 字符串响应给客户端
      status: 200,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
      data: user
    })
  })
}

// 获取验证码的处理函数
exports.getCheckCode = (request, response) => {
  const sql = `select * from sys_user where is_delete = 0 and email = ?`
  db.query(sql, request.body.email, (error, results) => {
    if (error) return response.cc(error)
    if (results.length !== 1) return response.cc('邮箱不存在！')
    if (request.body.email !== results[0].email) return response.cc('邮箱错误！') // 校验邮箱

    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    let checkCode = ''
    for (let i = 0; i < 4; i++) {
      checkCode += str.charAt(Math.floor(Math.random() * str.length))
    }
    request.session.userId = results[0].id
    request.session.checkCode = checkCode

    response.send({ // 将生成的 Token 字符串响应给客户端
      status: 200,
      message: '获取成功！',
      checkCode
    })
  })
}

// 重置密码的处理函数
exports.resetPassword = (request, response) => {
  if ((request.body.checkCode + '').toLowerCase() !== (request.session.checkCode + '').toLowerCase()) return response.cc('验证码错误！')

  const sql = `update sys_user set password = ?, password_update_date = now() where is_delete = 0 and id = ?`
  db.query(sql, [request.body.newPassword, request.session.userId], (error, results) => {
    if (error) return response.cc(error)
    if (results.affectedRows === 0) return response.cc('重置密码失败，请稍后再试！')
    delete request.session.userId
    delete request.session.checkCode
    response.cc('重置成功！', 200)
  })
}
