const express = require('express')
const expressJoi = require('@escook/express-joi') // 导入验证表单数据的中间件
const { addUserSchema, deleteUserSchema, updateUserSchema } = require('../model/users') // 导入需要的验证规则对象
const userHandler = require('../controller/users') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {get} /users 获取用户列表
 * @apiName GetUserList
 * @apiGroup 用户管理
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object[]} data 数据
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取用户列表成功！",
 *   "data": [
 *     {
 *       "id": 1, // 用户ID
 *       "dept": "市场部", // 部门
 *       "username": "admin", // 用户名称
 *       "user_type": "00", // 用户类型（00系统用户 01注册用户）
 *       "email": "2630819701@qq.com", // 邮箱
 *       "phone": "17374000851", // 手机号码
 *       "gender": "0", // 性别
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
router.get('/', userHandler.getUserList)

/**
 * @api {get} /users 获取用户列表
 * @apiName GetUserList
 * @apiGroup 用户管理
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object[]} data 数据
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
 *     "gender": "0", // 性别
 *     "status": "0", // 账号状态（0正常 1停用）
 *     "login_date": "2022-09-28T11:53:07.000Z", // 最后登录时间
 *     "password_update_date": "2022-09-28T11:53:07.000Z", // 密码最后更新时间
 *     "create_by": "admin", // 创建者
 *     "create_time": "2022-09-28T11:53:07.000Z", // 创建时间
 *     "remark": "管理员" // 备注
 *   }
 * }
 */
router.get('/:id', userHandler.getUserById)

router.post('/', expressJoi(addUserSchema), userHandler.addUser)

router.delete('/', expressJoi(deleteUserSchema), userHandler.deleteUser)

router.put('/', expressJoi(updateUserSchema), userHandler.updateUser)

module.exports = router
