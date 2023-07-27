const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const { db } = require('./db/db.js')

// 实例化express 定义端口
const app = express()
const PROT = 4000

// 跨域请求
app.use(cors())
// 处理json
app.use(express.json())

// 上传
const update = multer({
  dest: './public/upload/temp',
})
app.use(update.any())
// 静态资源目录
app.use(express.static(path.join(__dirname, 'public')))

// token验证中间件
const ADMIN_TOKEN_PATH = '/_token'
app.all('*', async (req, res, next) => {
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    // 验证token
    let { token } = req.headers
    let admin_info_sql = 'SELECT * FROM `admin` WHERE `token` = ?'
    let admin_result = await db.execute(admin_info_sql, [token])
    if (admin_result[0] == 0) {
      res.send({
        code: 400,
        message: '请先登录',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 注册路由
app.use('/test', require('./routers/testRouter'))
app.use('/admin', require('./routers/adminRouter'))
app.use('/category', require('./routers/categoryRouter'))
app.use('/blog', require('./routers/blogRouter'))
app.use('/upload', require('./routers/uploadRouter'))

// 监听端口
app.listen(PROT, () => {
  console.log(`running http://127.0.0.1:${PROT}`)
})
