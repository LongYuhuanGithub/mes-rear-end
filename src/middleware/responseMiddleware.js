// 响应信息的中间件
module.exports = (request, response, next) => {
  response.cc = (error, status = 500) => {
    response.send({
      status,
      message: error instanceof Error ? error.message : error
    })
  }
  next()
}
