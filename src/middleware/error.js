const joi = require('joi')

// 错误级别的中间件
module.exports = (error, request, response, next) => {
  if (error instanceof joi.ValidationError) return response.cc(error) // 数据验证失败
  if (error.name === 'UnauthorizedError') return response.send({ // 身份认证失败，出现这个错不会进响应数据的中间件，所以要用 send()
    status: 401,
    message: '身份认证失败'
  })
  response.cc(error) // 未知错误
}
