const db = require('../config')

// 获取菜单列表的处理函数
exports.getMenuList = (request, response) => {
  const sql = `select * from sys_menu`
  db.query(sql, (error, results) => {
    if (error) return response.cc(error)

    results.sort((a, b) => a.parent_id - b.parent_id) // 按照父菜单ID排序
    const menuList = results.filter(item => item.parent_id === 0) // 取出所有一级菜单，就是没有父菜单的菜单

    // 递归为每个菜单添加 children 属性，children 里面放该菜单下的子菜单
    const formatMenuList = (array) => {
      if (array) {
        array.forEach(item => {
          item.children = results.filter(item2 => item.id === item2.parent_id) // 取出当前菜单下的所有子菜单
          item.children.sort((a, b) => a.sort - b.sort) // 再给子菜单排序
          formatMenuList(item.children) // 继续往下递归给子菜单添加孙子菜单
        })
      }
    }
    formatMenuList(menuList)

    response.send({
      status: 200,
      message: '获取菜单列表成功！',
      data: menuList
    })
  })
}
