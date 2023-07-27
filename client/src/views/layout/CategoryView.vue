<script setup>
import { reactive, inject, onMounted, ref } from 'vue'
import { useAdminStore } from '@/stores/AdminStore.js'
import { useRoute, useRouter } from 'vue-router';

const axios = inject('axios')
const message = inject('message')
const dialog = inject('dialog')
const adminStore = useAdminStore()
const router = useRouter()

let categoryList = ref([])
onMounted(() => {
    loadDatas()
})
const loadDatas = async () => {
    let result = await axios.get('/category/list')
    categoryList.value = result.data.data
}

let showModal = ref(false)
let showUpdateModal = ref(false)
let addCategory = reactive({
    name: ''
})
let updateCategory = reactive({
    id: null,
    name: ''
})
const add = async () => {
    let result = await axios.post('/category/_token/add', { name: addCategory.name })

    console.log(result.data);
    if (result.data.code == 200) {
        message.success('添加成功')
        loadDatas()
    } else {
        message.error('请先登录')
    }
    showModal.value = !showModal.value
}
const deletehanle = async (itme) => {
    dialog.warning({
        title: '警告',
        content: '确定要删除这条数据吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let result = await axios.delete(`/category/_token/delete?id=${itme.id}`)
            console.log(result.data.code);
            if (result.data.code == 200) {
                message.success('删除成功')
                loadDatas()
            } else {
                message.error('请先登录')
            }
        },
        onNegativeClick: () => { }
    })
}
const toUpdate = async (item) => {
    showUpdateModal.value = !showUpdateModal.value
    updateCategory.id = item.id
    updateCategory.name = item.name
}
const updateHandle = async () => {
    let result = await axios.put(
        `/category/_token/update`,
        { id: updateCategory.id, name: updateCategory.name }
    )
    if (result.data.code == 200) {
        message.success('修改成功')
        loadDatas()
    } else {
        message.error('请先登录')
    }
    showUpdateModal.value = !showUpdateModal.value
}
</script>

<template>
    <n-table :bordered="false" :single-line="false">
        <thead>
            <tr>
                <th>编号</th>
                <th>名称</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in categoryList">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>
                    <n-space>
                        <n-button @click="toUpdate(item)">修改</n-button>
                        <n-button @click="deletehanle(item)">删除</n-button>
                    </n-space>
                </td>
            </tr>
        </tbody>
    </n-table>

    <n-button @click="showModal = !showModal">添加</n-button>

    <n-modal v-model:show="showModal" preset="dialog" title="Dialog" :mask-closable="false">
        <template #header>
            <div>添加分类</div>
        </template>
        <div>
            <n-input v-model:value="addCategory.name" type="text" placeholder="请输入要添加的类别"></n-input>
        </div>
        <template #action>
            <n-button @click="add()">提交</n-button>
        </template>
    </n-modal>

    <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog" :mask-closable="false">
        <template #header>
            <div>修改分类</div>
        </template>
        <div>
            <n-input v-model:value="updateCategory.name" type="text" placeholder="输入修改后的类别"></n-input>
        </div>
        <template #action>
            <n-button @click="updateHandle()">提交</n-button>
        </template>
    </n-modal>
</template>

<style scoped lang='scss'></style>