<script setup>
import { reactive, inject, onMounted, ref, computed, setBlockTracking } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const axios = inject('axios')
const router = useRouter()
const route = useRoute()

const blogInfo = ref([])

const loadBlogs = async () => {
    let result = await axios.get(`/blog/detail?id=${route.query.id}`)
    blogInfo.value = result.data.data[0]
}
const back = () => {
    router.push('/')
}
onMounted(() => {
    loadBlogs()
})
</script>

<template>
    <div class="container">
        <n-button @click="back">返回</n-button>
        <n-h1>{{ blogInfo.title }}</n-h1>
        <div>
            <div v-html='blogInfo.content'></div>
        </div>
    </div>
</template>

<style scoped lang='scss'>
.container {
    width: 1200px;
    margin: 0 auto;
}

:deep(img) {
    max-width: 100%;
}
</style>