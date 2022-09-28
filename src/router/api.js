const express = require('express')
const expressJoi = require('@escook/express-joi') // 导入验证表单数据的中间件
const { registerSchema, loginSchema, loginphoneSchema } = require('../schema/api') // 导入需要的验证规则对象
const apiHandler = require('../routerHandler/api') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {post} /api/register 注册用户
 * @apiName PostApiRegister
 * @apiGroup 无需访问权限的API
 *
 * @apiParam {String} username 用户名称
 * @apiParam {String} password 密码
 * @apiParam {String} email 邮箱
 * @apiParam {String} phone 手机
 * @apiParam {String} gender 性别（0男 1女 2未知）
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "注册成功！"
 * }
 */
router.post('/register', expressJoi(registerSchema), apiHandler.register)

/**
 * @api {post} /api/login 账号登录
 * @apiName PostApiLogin
 * @apiGroup 无需访问权限的API
 *
 * @apiParam {String} username 用户名称
 * @apiParam {String} password 密码
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {String} token Token令牌
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "登录成功！",
 *   "token": "Bearer ..."
 * }
 */
router.post('/login', expressJoi(loginSchema), apiHandler.login)

/**
 * @api {post} /api/loginphone 手机登录
 * @apiName PostApiLoginphone
 * @apiGroup 无需访问权限的API
 *
 * @apiParam {String} phone 手机号
 * @apiParam {String} password 密码
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {String} token Token令牌
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "登录成功！",
 *   "token": "Bearer ..."
 * }
 */
router.post('/loginphone', expressJoi(loginphoneSchema), apiHandler.loginphone)

module.exports = router
