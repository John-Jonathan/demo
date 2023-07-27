const express = require('express')
const { db, genid } = require('../db/db')

// 实例化路由
const router = express.Router()

// 添加接口
router.post('/_token/add', async (req, res) => {
  // 当分类id不传时，服务端会停止 标题和内容同理
  let { title, category_id, content } = req.body
  let id = genid.NextId()
  let create_time = new Date().getTime()
  const insert_sql =
    'INSERT INTO `blog` (`id`,`category_id`,`title`,`content`,`create_time`) VALUES (?,?,?,?,?)'
  let params = [id, category_id, title, content, create_time]
  let [rows, fields] = await db.execute(insert_sql, params)
  //   console.log(rows, fields)

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
  // 当分类id不传时，服务端会停止 标题和内容同理
  let { id, title, category_id, content } = req.body
  const update_sql = 'UPDATE `blog` SET `title` = ?,`category_id` = ?,`content` = ? WHERE `id` = ?'
  let params = [title, category_id, content, id]
  let [rows, fields] = await db.execute(update_sql, params)
  //   console.log(rows, fields)

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
  let id = req.query.id
  const delete_sql = 'DELETE FROM `blog` WHERE `id` = ?'
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
router.get('/search', async (req, res) => {
  let { keyword, category_id, page, pageSize } = req.query

  page = page == null ? 1 : page
  pageSize = pageSize == null ? 10 : pageSize
  category_id = category_id == null ? 0 : category_id
  keyword = keyword == null ? '' : keyword

  let params = []
  let where_sqls = []

  if (category_id != 0) {
    where_sqls.push('`category_id` = ?')
    params.push(category_id)
  }
  if (keyword != '') {
    where_sqls.push('(`title` LIKE ? OR `content` LIKE ?)')
    params.push('%' + keyword + '%')
    params.push('%' + keyword + '%')
  }
  let where_sql_str = ''
  if (where_sqls.length > 0) {
    where_sql_str = 'WHERE' + where_sqls.join(' AND ')
    // 如果分类id 和 关键字都有的情况下 查询字符串等于
    // WHERE `category_id` = ? AND `title` LIKE ? OR `content` LIKE ?
  }

  // 查询分页数据
  // 需要在order by前面加一个空格免得sql语句报错
  let search_sql =
    'SELECT * FROM `blog` ' + where_sql_str + ' ORDER BY `create_time` DESC LIMIT ?,?'
  // 这里的数据项应该传入string的类型 传入nuber类型时mysql2将报错 Error Incorrect arguments to mysqld_stmt_execute
  let search_sql_params = params.concat([(page - 1) * pageSize + '', pageSize + ''])

  // 查询总数
  // 需要给count(*)取一个别名 否则mysql2将返回一个count(*)的键值对 前端不好拿去数据
  let search_count_sql = 'SELECT count(*) as count FROM `blog`' + where_sql_str
  let search_count_sql_params = params

  // 分页数据
  let searchResult = await db.execute(search_sql, search_sql_params)
  let searchCountResult = await db.execute(search_count_sql, search_count_sql_params)

  if (searchResult.rows != 0) {
    res.send({
      code: 200,
      message: '查询成功',
      data: {
        keyword,
        category_id,
        page,
        pageSize,
        rows: searchResult[0],
        count: searchCountResult[0][0].count,
      },
    })
  } else {
    res.send({
      code: 500,
      message: '查询失败',
    })
  }
})

// 查询单页博客接口
router.get('/detail', async (req, res) => {
  let { id } = req.query
  let detail_sql = 'SELECT * FROM `blog` WHERE `id` = ?'
  let [rows, fields] = await db.execute(detail_sql, [id])

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
