const joi = require('joi')

const id = joi.number().integer().min(1).required() // ID的验证规则

exports.getRoleListByUserIdSchema = { // 按照用户ID获取角色列表的验证规则对象
  params: {
    id
  }
}
