const express = require('express')
const menuHandler = require('../router_handle/menuHandle') // 导入路由处理函数模块

const router = express.Router()

/**
 * @api {get} /menus 01-获取菜单列表
 * @apiName GetMenus
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
 *       "id": 2, // 菜单ID
 *       "menu_name": "系统管理", // 菜单名称
 *       "parent_id": 0, // 父菜单ID（0表示没有父级）
 *       "sort": 2, // 显示顺序
 *       "url": "/home", // 地址
 *       "menu_type": "M", // 菜单类型（M目录 C菜单 F按钮）
 *       "visible": "0", // 菜单状态（0显示 1隐藏）
 *       "icon": "icon-setting-fill", // 菜单图标
 *       "children": [ // 当前目录下的菜单
 *         {
 *           "id": 4,
 *           "menu_name": "用户管理",
 *           "parent_id": 2,
 *           "sort": 1,
 *           "url": "/home/users",
 *           "menu_type": "C",
 *           "visible": "1",
 *           "icon": "icon-appstore-fill",
 *           "children": [ // 当前菜单下的按钮
 *             {
 *               "id": 13,
 *               "menu_name": "添加用户",
 *               "parent_id": 4,
 *               "sort": 1,
 *               "url": "/home/users/add",
 *               "menu_type": "F",
 *               "visible": "1",
 *               "icon": "icon-plus",
 *               "children": []
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
router.get('/', menuHandler.getMenuList)

module.exports = router
