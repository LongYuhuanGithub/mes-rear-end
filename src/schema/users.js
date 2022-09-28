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

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()// 必须是 a-zA-Z0-9、最小1位、最大10位、不能为空的字符串
// 密码的验证规则
const password = joi.string().pattern(/^\S{6,12}$/).required()// 必须是 a-zA-Z0-9、6到12位、不能为空的字符串
// id的验证规则
const id = joi.number().integer().min(1).required()// 必须是数字类型的、必须是整数、最小1位，必填
// 昵称的验证规则
const nickname = joi.string().required()
// 邮箱的验证规则
const email = joi.string().email().required()
// 头像的验证规则，dataUri() 指的是指定格式的字符串数据: data:image/pngbase64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 用户的验证规则对象
exports.userSchema = {
  body: {
    username,
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
