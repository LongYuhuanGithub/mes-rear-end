const express = require('express')
const menuHandler = require('../controller/menuController') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {get} /menus 01-获取菜单列表
 * @apiName GetMenuList
 * @apiGroup Menus
 *
 * @apiHeader {String} Authorization Token令牌
 *
 * @apiSuccess {Number} status 状态码
 * @apiSuccess {String} message 消息
 * @apiSuccess {Object[]} data 数据
 * @apiSuccessExample {json} 响应数据示例
 * {
 *   "status": 200,
 *   "message": "获取菜单列表成功！",
 *   "data": [
 *     {
 *       "id": 1, // 菜单ID
 *       "menu_name": "系统管理", // 菜单名称
 *       "parent_id": 0, // 父菜单ID（0表示没有父级）
 *       "sort": 1, // 显示顺序
 *       "url": "/home", // 地址
 *       "menu_type": "M", // 菜单类型（M目录 C菜单 F按钮）
 *       "visible": "0", // 菜单状态（0显示 1隐藏）
 *       "icon": "setting" // 菜单图标
 *     }
 *   ]
 * }
 */
router.get('/', menuHandler.getMenuList)

module.exports = router
