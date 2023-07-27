const express = require('express')
const { db, genid } = require('../db/db')
const { v4: uuidv4 } = require('uuid')

// 实例化路由
const router = express.Router()

router.post('/login', async (req, res) => {
  let { account, password } = req.body

  let [rows, fields] = await db.query(
    'SELECT * FROM `admin` WHERE `account` = ? AND `password` = ?',
    [account, password]
  )

  // 查询错误时或没有查询到数据时 rows返回一个空数组 空数组和对象的值在判断时 为0
  if (rows != 0) {
    // 查询到数据
    let login_token = uuidv4()
    let login_token_sql = 'UPDATE `admin` SET `token` = ? WHERE `id` = ?'
    await db.query(login_token_sql, [login_token, rows[0].id])

    let adminInfo = rows[0]
    adminInfo.password = ''
    adminInfo.token = login_token

    res.send({
      code: 200,
      message: '登录成功',
      data: adminInfo,
    })
  } else {
    // 没有查询到数据时
    res.send({
      code: 500,
      message: '登录失败',
    })
  }
})

module.exports = router
