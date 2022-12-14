const express = require('express')
const expressJoi = require('@escook/express-joi') // 导入验证表单数据的中间件
const { getUserListSchema, idSchema, addUserSchema, updateUserSchema, resetPasswordSchema } = require('../schema/userSchema') // 导入需要的验证规则对象
const userHandler = require('../router_handle/userHandle') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {get} /users 01-获取用户列表
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiParam {Number} current 必需，当前页数，写在地址栏中
 * @apiParam {Number} size 必需，一页显示几行，写在地址栏中
 * @apiParam {String} username 可选，要搜索的用户名，写在地址栏中
 * @apiParam {String} phone 可选，要搜索的手机号，写在地址栏中
 * @apiParam {String} status 可选，要搜索的账号状态，写在地址栏中
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Number} total 总记录数
 * @apiSuccess {Object[]} data 用户列表数据
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取用户列表成功！",
 *   "total": 3,
 *   "data": [
 *     {
 *       "id": 1, // 用户ID
 *       "dept": "市场部", // 部门
 *       "username": "admin", // 用户名称
 *       "user_type": "00", // 用户类型（00系统用户 01注册用户）
 *       "email": "2630819701@qq.com", // 邮箱
 *       "phone": "17374000851", // 手机号码
 *       "gender": "0", // 性别（0男 1女 2未知）
 *       "status": "0", // 账号状态（0正常 1停用）
 *       "login_date": "2022-09-28T11:53:07.000Z", // 最后登录时间
 *       "password_update_date": "2022-09-28T11:53:07.000Z", // 密码最后更新时间
 *       "create_by": "admin", // 创建者
 *       "create_time": "2022-09-28T11:53:07.000Z", // 创建时间
 *       "remark": "管理员" // 备注
 *     }
 *   ]
 * }
 */
router.get('/', expressJoi(getUserListSchema), userHandler.getUserList)

/**
 * @api {get} /users/:id 02-根据ID获取用户
 * @apiName GetUsersId
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiParam {Number} id 必需，用户ID，写在地址栏中
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object} data 用户数据
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取用户成功！",
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
router.get('/:id', expressJoi(idSchema), userHandler.getUserById)

/**
 * @api {post} /users 03-添加用户
 * @apiName PostUsers
 * @apiGroup Users
 *
 * @apiParam {String} username 必需，用户名称
 * @apiParam {String} password 必需，密码
 * @apiParam {String} email 必需，邮箱
 * @apiParam {String} phone 必需，手机
 * @apiParam {String} gender 必需，性别（0男 1女 2未知）
 * @apiParam {String} create_by 必需，创建者的用户名
 * @apiParam {String} remark 必需，备注
 * @apiParam {Number[]} roleIds 必需，角色ID的数组
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "添加成功！"
 * }
 */
router.post('/', expressJoi(addUserSchema), userHandler.addUser)

/**
 * @api {delete} /users/:id 04-删除用户
 * @apiName DeleteUsers
 * @apiGroup Users
 *
 * @apiParam {Number} id 必需，用户ID，写在地址栏中
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "删除成功！"
 * }
 */
router.delete('/:id', expressJoi(idSchema), userHandler.deleteUser)

/**
 * @api {put} /users 05-修改用户
 * @apiName PutUsers
 * @apiGroup Users
 *
 * @apiParam {Number} id 必需，用户ID
 * @apiParam {String} email 必需，邮箱
 * @apiParam {String} phone 必需，手机
 * @apiParam {String} gender 必需，性别（0男 1女 2未知）
 * @apiParam {String} status 必需，帐号状态（0正常 1停用）
 * @apiParam {String} remark 必需，备注
 * @apiParam {Number[]} roleIds 必需，角色ID的数组
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "修改成功！"
 * }
 */
router.put('/', expressJoi(updateUserSchema), userHandler.updateUser)

/**
 * @api {put} /users/resetpassword 06-重置密码
 * @apiName PutUsersResetpassword
 * @apiGroup Users
 *
 * @apiParam {Number} id 必需，用户ID
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
router.put('/resetpassword', expressJoi(resetPasswordSchema), userHandler.resetPassword)

module.exports = router
