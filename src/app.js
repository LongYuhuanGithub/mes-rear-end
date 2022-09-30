const express = require('express')
const cors = require('cors') // 解决跨域问题
const expressJWT = require('express-jwt') // 解析 Token 的中间件
const moment = require('moment')
const config = require('./utils/globalUtils') // 导入配置文件
// 导入自定义中间件
const response = require('./middleware/responseMiddleware')
const error = require('./middleware/errorMiddleware')
// 导入路由模块
const apiRouter = require('./router/apiRouter')
const userRouter = require('./router/userRouter')
const menusRouter = require('./router/menuRouter')

const app = express()
moment.locale('zh-cn')

app.use(express.urlencoded({ extended: false })) // Content-Type: application/x-www-form-urlencoded
app.use(express.json()) // 解析 Content-Type: application/json
app.use(cors())
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })) // 指定 /api/ 路径不需要访问权限

// 响应信息的中间件
app.use(response)

// 注册路由模块
app.use('/api', apiRouter)
app.use('/users', userRouter)
app.use('/menus', menusRouter)

// 错误级别的中间件
app.use(error)

app.listen(3000, () => {
  console.log('api server running at http://localhost:3000')
})
