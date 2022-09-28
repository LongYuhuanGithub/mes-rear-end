const joi = require('joi')

/**
 * string(): 表示值必须是字符串
 * number(): 表示值必须是数字
 * integer(): 必须是整数
 * alphanum(): 表示值只能是包含 a-zA-Z0-9 的字符串
 * min(length): 表示最小长度
 * max(length): 表示最大长度
 * required(): 表示值是必填项，不能为 undefined
 * pattern(正则表达式): 表示值必须符合正则表达式的规则
 */

const username = joi.string().alphanum().min(1).max(10).required() // 用户名的验证规则
const password = joi.string().pattern(/^\S{6,12}$/).required() // 密码的验证规则
const phone = joi.string().pattern(/^1[35789]\d{9}$/).required() // 手机的验证规则
const email = joi.string().email().required() // 邮箱的验证规则

// 账户登录的验证规则对象
exports.userSchema = {
  body: {
    username,
    password
  }
}

// 手机登录的验证规则对象
exports.userSchema = {
  body: {
    phone,
    password
  }
}

// 重置密码的验证规则对象
exports.updatePasswordSchema = {
  body: {
    oldPassword: password,
    newPassword: joi.not(joi.ref('oldPassword')).concat(password)
  }
}
