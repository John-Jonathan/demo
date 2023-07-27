const express = require('express')
const { db, genid } = require('../db/db')

// 实例化路由
const router = express.Router()

// 添加接口
router.post('/_token/add', async (req, res) => {
  // 获取request json中传送的name值
  let { name } = req.body
  const insert_sql = 'INSERT INTO `category` (`id`,`name`) VALUES (?,?)'
  // 通过genid.NextId() 生成一个随机的id值
  let [rows, fields] = await db.execute(insert_sql, [genid.NextId(), name])
  // console.log(rows, fields)

  // affectedRows 代表影响数据库数据的行数 不为0时就代表至少影响了一条数据，就为成功
  if (rows.affectedRows != 0) {
    res.send({
      code: 200,
      message: '添加成功',
    })
  } else {
    res.send({
      code: 500,
      message: '添加失败',
    })
  }
})

// 修改接口
router.put('/_token/update', async (req, res) => {
  let { id, name } = req.body
  const update_sql = 'UPDATE `category` SET `name` = ? WHERE `id` = ?'
  let [rows] = await db.execute(update_sql, [name, id])
  //   console.log(rows.affectedRows)

  if (rows.affectedRows != 0) {
    res.send({
      code: 200,
      message: '修改成功',
    })
  } else {
    res.send({
      code: 500,
      message: '修改失败',
    })
  }
})

// 删除接口
router.delete('/_token/delete', async (req, res) => {
  // 前端传来的 /category/delete?id=xxx
  let id = req.query.id
  const delete_sql = 'DELETE FROM `category` WHERE `id` = ?'
  let [rows, fields] = await db.execute(delete_sql, [id])
  //   console.log(rows, fields)

  if (rows.affectedRows != 0) {
    res.send({
      code: 200,
      message: '删除成功',
    })
  } else {
    res.send({
      code: 500,
      message: '删除失败',
    })
  }
})

// 查询接口
router.get('/list', async (req, res) => {
  const search_sql = 'SELECT * FROM `category`'
  let [rows, fields] = await db.execute(search_sql)
  // console.log(rows, fields)

  if (rows != 0) {
    res.send({
      code: 200,
      message: '查询成功',
      data: rows,
    })
  } else {
    res.send({
      code: 500,
      message: '查询失败',
    })
  }
})

module.exports = router
