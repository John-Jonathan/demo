<script setup>
import { reactive, inject, onMounted, ref } from 'vue'
import { useAdminStore } from '@/stores/AdminStore.js'
import { useRoute, useRouter } from 'vue-router';
import WangEditor from '@/components/WangEditor.vue'

const axios = inject('axios')
const message = inject('message')
const dialog = inject('dialog')
const adminStore = useAdminStore()
const router = useRouter()

const addArticle = reactive({
    title: '',
    content: '',
    category_id: ''
})
const updateArticle = reactive({
    id: null,
    title: '',
    content: '',
    category_id: ''
})

const categoryOptions = ref([])
const blogList = ref([])
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0
})
const loadCategory = async () => {
    let result = await axios.get('/category/list')
    categoryOptions.value = result.data.data.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
}
const loadBlogs = async () => {
    let result = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    // console.log(result);
    let temp = result.data.data.rows
    for (let row of temp) {
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogList.value = temp

    pageInfo.count = result.data.data.count
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize)
}
onMounted(() => {
    loadCategory()
    loadBlogs()
})
const add = async () => {
    let result = await axios.post('/blog/_token/add', addArticle)

    // console.log(result.data);
    if (result.data.code == 200) {
        message.success('添加成功')
    } else {
        message.error('请先登录')
    }
}
const toPage = (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}

const tabValue = ref('list')
const toUpdate = async (blog) => {
    tabValue.value = 'update'
    let result = await axios.get(`/blog/detail?id=${blog.id}`)
    updateArticle.id = blog.id
    updateArticle.title = result.data.data[0].title
    updateArticle.content = result.data.data[0].content
    updateArticle.category_id = result.data.data[0].category_id
}
const update = async () => {
    let result = await axios.put('/blog/_token/update', updateArticle)
    if (result.data.code == 200) {
        message.success('修改成功')
        loadBlogs()
        tabValue.value = 'list'
    } else {
        message.error('请先登录')
    }
}
const deleteHandle = async (blog) => {
    let result = await axios.delete(`/blog/_token/delete?id=${blog.id}`)
    if (result.data.code == 200) {
        message.success('删除成功')
        loadBlogs()
    } else {
        message.error('请先登录')
    }
}
</script>

<template>
    <n-tabs type="line" animated v-model:value="tabValue">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="blog in blogList">
                <n-card :title="blog.title" style="margin: 20px;">
                    {{ blog.content }}

                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="deleteHandle(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>

            <n-space>
                <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
                    <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">{{ pageNum }}</div>
                </div>
            </n-space>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入文章标题"></n-input>
                </n-form-item>

                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.category_id" :options="categoryOptions"></n-select>
                </n-form-item>

                <n-form-item label="内容">
                    <wang-editor v-model="addArticle.content"></wang-editor>
                </n-form-item>

                <n-form-item label="添加">
                    <n-button @click="add()">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入文章标题"></n-input>
                </n-form-item>

                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.category_id" :options="categoryOptions"></n-select>
                </n-form-item>

                <n-form-item label="内容">
                    <wang-editor v-model="updateArticle.content"></wang-editor>
                </n-form-item>

                <n-form-item label="修改">
                    <n-button @click="update()">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>

    </n-tabs>
</template>

<style scoped lang='scss'></style>