// 全局配置文件

// 格式化日期的方法
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = padZero(date.getMonth() + 1)
  const d = padZero(date.getDate())
  const hh = padZero(date.getHours())
  const mm = padZero(date.getMinutes())
  const ss = padZero(date.getSeconds())
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

// 补零的函数
function padZero(n) {
  return n > 9 ? n : '0' + n
}

module.exports = {
  jwtSecretKey: 'LongYuhuan', // 加密和解密 Token 的密钥
  expiresIn: '10h', // Token 的有效期
  formatDate // 格式化日期
}
