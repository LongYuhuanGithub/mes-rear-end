const express = require('express')
const cors = require('cors') // 解决跨域问题
const expressJWT = require('express-jwt') // 解析 Token 的中间件
const joi = require('joi')
const config = require('./config') // 导入配置文件
// 导入路由模块
const userRouter = require('./router/users')

const app = express()

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
app.use('/api', userRouter)

// 错误级别的中间件
app.use((error, request, response, next) => {
  if (error instanceof joi.ValidationError) return response.cc(error) // 数据验证失败
  if (error.name === 'UnauthorizedError') return response.cc('身份认证失败！') // 身份认证失败
  response.cc(error) // 未知错误
})

app.listen(3000, () => {
  console.log('api server running at http://localhost:3000')
})
