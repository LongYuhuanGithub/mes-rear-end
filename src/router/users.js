const express = require('express')
const expressJoi = require('@escook/express-joi') // 导入验证表单数据的中间件
const { userSchema } = require('../schema/apis') // 导入需要的验证规则对象
const userHandler = require('../routerHandler/apis') // 导入用户路由处理函数模块

const router = express.Router()

/**
 * @api {post} /api/register 注册用户
 * @apiName PostApiRegister
 * @apiGroup 无需访问权限的API
 *
 * @apiParam {String} username 用户名称
 * @apiParam {String} password 密码
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccessExample {json} 响应数据
 * {
 *   "status": 200,
 *   "message": "注册成功！"
 * }
 */
router.get('/users', expressJoi(userSchema), userHandler.register)

module.exports = router
