const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors') // 解决跨域问题
const expressJWT = require('express-jwt') // 解析 Token 的中间件
const joi = require('joi')
const moment = require('moment')
const config = require('./utils/config') // 导入配置文件
// 导入路由模块
const apiRouter = require('./router/api')
const userRouter = require('./router/users')
const menusRouter = require('./router/menus')

const app = express()
moment.locale('zh-cn')

app.use(cookieParser())
app.use(session({
  secret: "LongYuhuan", // 设置签名秘钥，内容可以任意填写
  cookie: { maxAge: 1000 * 60 * 3 }, // 3 分钟后 cookie 过期
  resave: true, // 强制保存，如果 session 没有被修改也要重新保存
  saveUninitialized: false // 如果原先没有 session 那么就设置，否则不设置
}))
app.use(express.urlencoded({ extended: false })) // Content-Type: application/x-www-form-urlencoded
app.use(express.json()) // 解析 Content-Type: application/json
app.use(cors())
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })) // 指定 /api/ 路径不需要访问权限

// 响应信息的中间件
app.use((request, response, next) => {
  response.cc = (error, status = 500) => {
    response.send({
      status,
      message: error instanceof Error ? error.message : error
    })
  }
  next()
})

// 注册路由模块
app.use('/api', apiRouter)
app.use('/users', userRouter)
app.use('/menus', menusRouter)

// 错误级别的中间件
app.use((error, request, response, next) => {
  if (error instanceof joi.ValidationError) return response.cc(error) // 数据验证失败
  if (error.name === 'UnauthorizedError') return response.cc('身份认证失败！') // 身份认证失败
  response.cc(error) // 未知错误
})

app.listen(3000, () => {
  console.log('api server running at http://localhost:3000')
})
