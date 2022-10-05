const db = require('../config')
const config = require('../utils/globalUtils') // 导入配置文件
const md5 = require('md5') // 导入 md5 加密
const bcrypt = require('bcryptjs') // 导入加密模块
const jwt = require('jsonwebtoken') // 用这个包来生成 Token 字符串
const moment = require('moment')

const serverData = {} // 记录一些数据，如验证码

// 注册用户的处理函数
exports.register = async (request, response) => {
  let sql, result

  // 校验重复并给密码加密
  result = await new Promise((resolve, reject) => {
    sql = `select * from sys_user where is_delete = 0 and (username = ? or email = ? or phone = ?)`
    db.query(sql, [request.body.username, request.body.email, request.body.phone], (error, results) => {
      if (error) return reject({ flag: true, error })
      if (results.length > 0) {
        if (results[0].username === request.body.username) return reject({ flag: true, error: '用户名被占用，请更换其他用户名！' })
        if (results[0].email === request.body.email) return reject({ flag: true, error: '邮箱被占用，请更换其他邮箱！' })
        if (results[0].phone === request.body.phone) return reject({ flag: true, error: '手机被占用，请更换其他手机！' })
      }

      // 密码加密
      const salt = Math.floor(Math.random() * 9000000000) + 1000000000 // 随机生成一个盐
      request.body.password = md5(md5(request.body.password + salt)) // 两次 md5 加密
      request.body.password = bcrypt.hashSync(request.body.password, 10) // bcryptjs 加密
      resolve({ flag: false, salt })
    })
  }).catch(error => error)
  if (result.flag) return response.cc(result.error)

  // 添加用户
  result = await new Promise((resolve, reject) => {
    // 添加用户
    sql = `insert into sys_user set ?`
    db.query(sql, {
      username: request.body.username,
      password: request.body.password,
      salt: result.salt,
      user_type: '01',
      email: request.body.email,
      phone: request.body.phone,
      gender: request.body.gender,
      login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      password_update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      create_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }, (error, results) => {
      if (error) return reject({ flag: true, error })
      if (!results.affectedRows) return reject({ flag: true, error: '注册用户失败，请稍后再试！' })
      resolve({ flag: false, insertId: results.insertId })
    })
  }).catch(error => error)
  if (result.flag) return response.cc(result.error)

  // 添加用户角色关系
  result = await new Promise((resolve, reject) => {
    sql = `insert into sys_user_role values(?, 2)`
    db.query(sql, [result.insertId], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('添加用户角色关系失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 响应
  response.cc('注册成功！', 200)
}

// 账号登录的处理函数
exports.login = async (request, response) => {
  let sql, result

  // 校验信息并生成 token
  result = await new Promise((resolve, reject) => {
    sql = `select * from sys_user where is_delete = 0 and username = ?`
    db.query(sql, request.body.username, (error, results) => {
      if (error) return reject({ flag: true, error })
      if (results.length !== 1) return reject({ flag: true, error: '用户不存在！' })

      request.body.password = md5(md5(request.body.password + results[0].salt)) // 两次 md5 加密
      if (!bcrypt.compareSync(request.body.password, results[0].password) && results[0].password !== '123456')
        return reject({ flag: true, error: '登录失败！' }) // 校验密码

      const user = { ...results[0] }
      delete user.password // 剔除 password 属性
      delete user.salt
      delete user.is_delete
      const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn }) // 生成 Token 字符串
      resolve({ flag: false, token, user })
    })
  }).catch(error => error)
  if (result.flag) return response.cc(result.error)

  // 转存 token 和 user
  const token = result.token, user = result.user

  // 修改最后登录时间
  result = await new Promise((resolve, reject) => {
    sql = `update sys_user set login_date = now() where id = ?`
    db.query(sql, [user.id], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('修改最后登录时间失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 响应
  response.send({
    status: 200,
    message: '登录成功！',
    token: 'Bearer ' + token,
    data: user
  })
}

// 手机登录的处理函数
exports.loginPhone = async (request, response) => {
  let sql, result

  // 校验信息并生成 token
  result = await new Promise((resolve, reject) => {
    sql = `select * from sys_user where is_delete = 0 and phone = ?`
    db.query(sql, request.body.phone, (error, results) => {
      if (error) return reject({ flag: true, error })
      if (results.length !== 1) return reject({ flag: true, error: '用户不存在！' })

      request.body.password = md5(md5(request.body.password + results[0].salt)) // 两次 md5 加密
      if (!bcrypt.compareSync(request.body.password, results[0].password) && results[0].password !== '123456')
        return reject({ flag: true, error: '登录失败！' }) // 校验密码

      const user = { ...results[0] }
      delete user.password // 剔除 password 属性
      delete user.salt
      delete user.is_delete
      const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn }) // 生成 Token 字符串
      resolve({ flag: false, token, user })
    })
  }).catch(error => error)
  if (result.flag) return response.cc(result.error)

  // 转存 token 和 user
  const token = result.token, user = result.user

  // 修改最后登录时间
  result = await new Promise((resolve, reject) => {
    sql = `update sys_user set login_date = now() where id = ?`
    db.query(sql, [user.id], (error, results) => {
      if (error) return reject(error)
      if (!results.affectedRows) return reject('修改最后登录时间失败，请稍后再试！')
      resolve()
    })
  }).catch(error => error)
  if (result) return response.cc(result)

  // 响应
  response.send({
    status: 200,
    message: '登录成功！',
    token: 'Bearer ' + token,
    data: user
  })
}

// 获取验证码的处理函数
exports.getCheckCode = (request, response) => {
  // 按照邮箱查询用户
  const sql = `select * from sys_user where is_delete = 0 and email = ?`
  db.query(sql, request.body.email, (error, results) => {
    if (error) return response.cc(error)
    if (results.length !== 1) return response.cc('邮箱不存在！')
    if (request.body.email !== results[0].email) return response.cc('邮箱错误！') // 校验邮箱

    // 生成验证码并保存至 serverData 变量
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    let checkCode = ''
    for (let i = 0; i < 4; i++) {
      checkCode += str.charAt(Math.floor(Math.random() * str.length))
    }
    serverData.userId = results[0].id
    serverData.salt = results[0].salt
    serverData.checkCode = checkCode

    // 响应
    response.send({
      status: 200,
      message: '获取成功！',
      checkCode
    })
  })
}

// 重置密码的处理函数
exports.resetPassword = (request, response) => {
  // 校验验证码
  if ((request.body.checkCode + '').toLowerCase() !== (serverData.checkCode + '').toLowerCase()) {
    delete serverData.userId
    delete serverData.salt
    delete serverData.checkCode
    return response.cc('验证码错误！')
  }

  // 密码加密
  request.body.newPassword = md5(md5(request.body.newPassword + serverData.salt)) // 两次 md5 加密
  request.body.newPassword = bcrypt.hashSync(request.body.newPassword, 10) // bcryptjs 加密

  // 重置密码
  const sql = `update sys_user set password = ?, password_update_date = now() where is_delete = 0 and id = ?`
  db.query(sql, [request.body.newPassword, serverData.userId], (error, results) => {
    if (error) return response.cc(error)
    if (!results.affectedRows) return response.cc('重置密码失败，请稍后再试！')
    delete serverData.userId
    delete serverData.salt
    delete serverData.checkCode
    response.cc('重置成功！', 200)
  })
}
