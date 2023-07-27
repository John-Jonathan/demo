const express = require('express')
const { db, genid } = require('../db/db')
const fs = require('fs')

// 实例化路由
const router = express.Router()

router.post('/rich_editor_upload', async (req, res) => {
  if (!req.files) {
    res.send({
      errno: 1,
      message: '失败信息',
    })
    return
  }

  let files = req.files
  let ret_files = []

  for (let file of files) {
    // console.log(file)
    let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
    let file_name = genid.NextId() + '.' + file_ext

    fs.renameSync(
      process.cwd() + '/public/upload/temp/' + file.filename,
      process.cwd() + '/public/upload/' + file_name
    )
    ret_files.push('/upload/' + file_name)
  }

  res.send({
    errno: 0,
    data: {
      url: ret_files[0],
    },
  })
})

module.exports = router
