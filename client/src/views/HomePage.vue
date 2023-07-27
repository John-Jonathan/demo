<script setup>
import { reactive, inject, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const axios = inject('axios')
const router = useRouter()

const selectCategory = ref(0)
const categoryOptions = ref([])
const blogList = ref([])
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0,
    keyword: '',
    category_id: 0
})

const categoryName = computed(() => {
    let selectOption = categoryOptions.value.find((option) => { return option.value == selectCategory.value })
    return selectOption ? selectOption.label : ''
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

const loadBlogs = async (page = 0) => {
    if (page != 0) {
        pageInfo.page = page
    }
    let result = await axios.get(
        `/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&keyword=${pageInfo.keyword}&category_id=${pageInfo.category_id}`
    )
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
const searchCategory = (category_id) => {
    pageInfo.category_id = category_id
    loadBlogs()
}
const homePage = () => {
    router.push('/')
}
const layout = () => {
    router.push('/login')
}
const toDetail = (blog) => {
    router.push({ path: '/detail', query: { id: blog.id } })
}

onMounted(() => {
    loadCategory()
    loadBlogs()
})
</script>

<template>
    <div class="container">
        <div class="nav">
            <div @clic="homePage">首页</div>
            <div>
                <n-popselect @update:value="searchCategory" v-model:value="selectCategory" :options="categoryOptions"
                    trigger="click">
                    <div>分类<span>{{ categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="layout">后台</div>
        </div>

        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字"></n-input>
            <n-button type="primary" ghost @click="loadBlogs(0)">搜索</n-button>
        </n-space>

        <div v-for="blog in blogList">
            <n-card :title="blog.title" style="margin: 20px;" @click="toDetail(blog)">
                {{ blog.content }}

                <template #footer>
                    <n-space align="center">
                        <div>发布时间：{{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>

        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
    </div>
</template>

<style scoped lang='scss'>
.container {
    width: 1200px;
    margin: 0 auto;

    .search {
        margin-bottom: 10px;
    }
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;

    div {
        cursor: pointer;
        margin-right: 20px;

        &:hover {
            color: #008c8c;
        }

        span {
            font-size: 12px;
            margin-left: 5px;
        }
    }
}
</style>