const joi = require('joi')

const id = joi.number().integer().min(1).required() // ID的验证规则
const roleIds = joi.array().items(joi.number().integer().min(1)).required() // 角色ID数组的验证规则
const username = joi.string().alphanum().min(1).max(10).required() // 用户名的验证规则
const password = joi.string().pattern(/^\S{6,12}$/).required() // 密码的验证规则
const email = joi.string().email().required() // 邮箱的验证规则
const phone = joi.string().pattern(/^1[35789]\d{9}$/).required() // 手机的验证规则
const gender = joi.string().pattern(/^0|1|2$/).required() // 性别的验证规则
const status = joi.string().pattern(/^0|1$/).required() // 状态的验证规则

exports.getUserListSchema = { // 获取用户列表的验证规则对象
  query: {
    current: id,
    size: id,
    username: joi.string().alphanum().min(1).max(10),
    phone: joi.string().pattern(/^\d+$/),
    status: joi.string().pattern(/^0|1$/)
  }
}

exports.idSchema = { // 动态参数中ID的验证规则对象
  params: {
    id
  }
}

exports.addUserSchema = { // 添加用户的验证规则对象
  body: {
    username,
    password,
    email,
    phone,
    gender,
    create_by: joi.string().required(),
    remark: joi.string().required(),
    roleIds
  }
}

exports.updateUserSchema = { // 修改用户的验证规则对象
  body: {
    id,
    email,
    phone,
    gender,
    status,
    remark: joi.string().required(),
    roleIds
  }
}

exports.resetPasswordSchema = { // 重置密码的验证规则对象
  body: {
    id,
    newPassword: password,
    affirmPassword: joi.equal(joi.ref('newPassword')).concat(password)
  }
}
