const express = require('express')
const expressJoi = require('@escook/express-joi') // 导入验证表单数据的中间件
const { registerSchema, loginSchema, loginPhoneSchema, getCheckCodeSchema, resetPasswordSchema } = require('../schema/apiSchema') // 导入需要的验证规则对象
const apiHandler = require('../router_handle/apiHandle') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {post} /api/register 01-注册用户
 * @apiName PostApiRegister
 * @apiGroup PublicApi
 *
 * @apiParam {String} username 必需，用户名称
 * @apiParam {String} password 必需，密码
 * @apiParam {String} email 必需，邮箱
 * @apiParam {String} phone 必需，手机
 * @apiParam {String} gender 必需，性别（0男 1女 2未知）
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
 * @apiParam {String} username 必需，用户名称
 * @apiParam {String} password 必需，密码
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object} data 用户数据
 * @apiSuccess {String} token Token令牌
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "登录成功！",
 *   "token": "Bearer ...",
 *   "data": {
 *     "id": 1, // 用户ID
 *     "dept": "市场部", // 部门
 *     "username": "admin", // 用户名称
 *     "user_type": "00", // 用户类型（00系统用户 01注册用户）
 *     "email": "2630819701@qq.com", // 邮箱
 *     "phone": "17374000851", // 手机号码
 *     "gender": "0", // 性别（0男 1女 2未知）
 *     "status": "0", // 账号状态（0正常 1停用）
 *     "login_date": "2022-09-28T11:53:07.000Z", // 最后登录时间
 *     "password_update_date": "2022-09-28T11:53:07.000Z", // 密码最后更新时间
 *     "create_by": "admin", // 创建者
 *     "create_time": "2022-09-28T11:53:07.000Z", // 创建时间
 *     "remark": "管理员" // 备注
 *   }
 * }
 */
router.post('/login', expressJoi(loginSchema), apiHandler.login)

/**
 * @api {post} /api/loginphone 03-手机登录
 * @apiName PostApiLoginphone
 * @apiGroup PublicApi
 *
 * @apiParam {String} phone 必需，手机号
 * @apiParam {String} password 必需，密码
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object} data 用户数据
 * @apiSuccess {String} token Token令牌
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "登录成功！",
 *   "token": "Bearer ...",
 *   "data": {
 *     "id": 1, // 用户ID
 *     "dept": "市场部", // 部门
 *     "username": "admin", // 用户名称
 *     "user_type": "00", // 用户类型（00系统用户 01注册用户）
 *     "email": "2630819701@qq.com", // 邮箱
 *     "phone": "17374000851", // 手机号码
 *     "gender": "0", // 性别（0男 1女 2未知）
 *     "status": "0", // 账号状态（0正常 1停用）
 *     "login_date": "2022-09-28T11:53:07.000Z", // 最后登录时间
 *     "password_update_date": "2022-09-28T11:53:07.000Z", // 密码最后更新时间
 *     "create_by": "admin", // 创建者
 *     "create_time": "2022-09-28T11:53:07.000Z", // 创建时间
 *     "remark": "管理员" // 备注
 *   }
 * }
 */
router.post('/loginphone', expressJoi(loginPhoneSchema), apiHandler.loginPhone)

/**
 * @api {post} /api/getcheckcode 04-获取验证码
 * @apiName PostApiGetcheckcode
 * @apiGroup PublicApi
 *
 * @apiParam {String} email 必需，邮箱
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
 * @api {put} /api/resetpassword 05-根据验证码重置密码
 * @apiName PostApiResetpassword
 * @apiGroup PublicApi
 *
 * @apiParam {String} checkCode 必需，验证码
 * @apiParam {String} newPassword 必需，新密码
 * @apiParam {String} affirmPassword 必需，确认密码
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
