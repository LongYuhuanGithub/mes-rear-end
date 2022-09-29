const express = require('express')
const expressJoi = require('@escook/express-joi') // 导入验证表单数据的中间件
const { registerSchema, loginSchema, loginPhoneSchema, getCheckCodeSchema, resetPasswordSchema } = require('../model/api') // 导入需要的验证规则对象
const apiHandler = require('../controller/api') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {post} /api/register 01-注册用户
 * @apiName PostApiRegister
 * @apiGroup PublicApi
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
 * @api {post} /api/login 02-账号登录
 * @apiName PostApiLogin
 * @apiGroup PublicApi
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
 * @api {post} /api/loginphone 03-手机登录
 * @apiName PostApiLoginphone
 * @apiGroup PublicApi
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
router.post('/loginphone', expressJoi(loginPhoneSchema), apiHandler.loginPhone)

/**
 * @api {post} /api/getcheckcode 04-获取验证码
 * @apiName PostApiGetcheckcode
 * @apiGroup PublicApi
 *
 * @apiParam {String} email 邮箱
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {String} checkCode 验证码
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取成功！",
 *   "checkCode": "bmOM"
 * }
 */
router.post('/getcheckcode', expressJoi(getCheckCodeSchema), apiHandler.getCheckCode)

/**
 * @api {put} /api/resetpassword 05-重置密码
 * @apiName PostApiResetpassword
 * @apiGroup PublicApi
 *
 * @apiParam {String} checkCode 验证码
 * @apiParam {String} newPassword 新密码
 * @apiParam {String} affirmPassword 确认密码
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "重置成功！"
 * }
 */
router.put('/resetpassword', expressJoi(resetPasswordSchema), apiHandler.resetPassword)

module.exports = router
