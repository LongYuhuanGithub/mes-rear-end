const express = require('express')
const { getRoleListByUserIdSchema } = require('../schema/roleSchema') // 导入需要的验证规则对象
const roleHandler = require('../router_handle/roleHandle')
const expressJoi = require("@escook/express-joi"); // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {get} /roles 01-获取角色列表
 * @apiName GetRoles
 * @apiGroup roles
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object[]} data 角色列表数据
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取角色列表成功！",
 *   "data": [
 *     {
 *       "id": 1, // 角色ID
 *       "role_name": "超级管理员", // 角色名称
 *       "sort": 1, // 显示顺序
 *       "status": "0", // 角色状态（0正常 1停用）
 *       "create_by": "admin", // 创建者
 *       "create_time": "2022-09-30T06:20:24.000Z", // 创建时间
 *       "remark": "超级管理员" // 备注
 *     }
 *   ]
 * }
 */
router.get('/', roleHandler.getRoleList)

/**
 * @api {get} /roles/getrolelistbyuserid/:id 02-按照用户ID获取角色列表
 * @apiName GetRolesGetrolelistbyuserid
 * @apiGroup roles
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiParam {Number} id 必需，用户ID，写在地址栏中
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object[]} data 角色列表数据
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取角色列表成功！",
 *   "data": [
 *     {
 *       "id": 1, // 角色ID
 *       "role_name": "超级管理员", // 角色名称
 *       "sort": 1, // 显示顺序
 *       "status": "0", // 角色状态（0正常 1停用）
 *       "create_by": "admin", // 创建者
 *       "create_time": "2022-09-30T06:20:24.000Z", // 创建时间
 *       "remark": "超级管理员" // 备注
 *     }
 *   ]
 * }
 */
router.get('/getrolelistbyuserid/:id', expressJoi(getRoleListByUserIdSchema), roleHandler.getRoleListByUserId)

module.exports = router
