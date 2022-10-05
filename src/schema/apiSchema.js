const joi = require('joi')

const username = joi.string().alphanum().min(1).max(10).required() // 用户名的验证规则
const password = joi.string().pattern(/^\S{6,12}$/).required() // 密码的验证规则
const email = joi.string().email().required() // 邮箱的验证规则
const phone = joi.string().pattern(/^1[35789]\d{9}$/).required() // 手机的验证规则
const gender = joi.string().pattern(/^0|1|2$/).required() // 性别的验证规则
const checkCode = joi.string().pattern(/^\w{4}$/).required() // 验证码的验证规则

exports.registerSchema = { // 注册用户的验证规则对象
  body: {
    username,
    password,
    email,
    phone,
    gender
  }
}

exports.loginSchema = { // 账户登录的验证规则对象
  body: {
    username,
    password
  }
}

exports.loginPhoneSchema = { // 手机登录的验证规则对象
  body: {
    phone,
    password
  }
}

exports.getCheckCodeSchema = { // 获取验证码的验证规则对象
  body: {
    email
  }
}

exports.resetPasswordSchema = { // 重置密码的验证规则对象
  body: {
    checkCode,
    newPassword: password,
    affirmPassword: joi.equal(joi.ref('newPassword')).concat(password)
  }
}
