<script setup>
import { reactive, inject } from 'vue'
import { useAdminStore } from '@/stores/AdminStore.js'
import { useRoute, useRouter } from 'vue-router';

const axios = inject('axios')
const message = inject('message')
const adminStore = useAdminStore()
const router = useRouter()

const menus = [
    { name: '文章管理', herf: '/layout/article' },
    { name: '分类管理', herf: '/layout/category' },
    { name: '退出登录', herf: '/login' },
]

const toPage = (item) => {
    router.push(item.herf)
}
</script>

<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(item, index) in menus" @click="toPage(item)" key="index">
                {{ item.name }}
            </div>
        </div>
        <div style="padding: 20px;width: 100%;">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped lang='scss'>
.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}

.menus {
    padding: 20px;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;

        &:hover {
            color: #fd760e;
        }
    }
}
</style>