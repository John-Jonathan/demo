const express = require('express')
const { db, genid } = require('../db/db')

// 实例化路由
const router = express.Router()

router.get('/test', async (req, res) => {
  let [err, rows, fields] = await db.execute('select * from `admin`')
  console.log(rows)
  console.log(err)
  console.log(fields)

  res.send({
    id: genid.NextId(),
  })
})

module.exports = router
