<script setup>
import { reactive, inject } from 'vue'
import { useAdminStore } from '@/stores/AdminStore.js'
import { useRoute, useRouter } from 'vue-router';

const axios = inject('axios')
const message = inject('message')
const adminStore = useAdminStore()
const router = useRouter()

const rules = {
  account: [
    { required: true, message: '请输入账户', trigger: 'blur' },
    { min: 3, max: 12, message: '账户3-12位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码6-18位', trigger: 'blur' },
  ],
}
const admin = reactive({
  account: localStorage.getItem('account') || '',
  password: localStorage.getItem('password') || '',
  rember: localStorage.getItem('rember') == 1,
})
const login = async () => {
  let result = await axios.post('/admin/login', {
    account: admin.account,
    password: admin.password
  })

  if (result.data.code == 200) {
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id

    if (admin.rember) {
      localStorage.setItem('account', admin.account)
      localStorage.setItem('password', admin.password)
      localStorage.setItem('rember', admin.rember ? 1 : 0)
    }
    message.success('登录成功')
    router.push('/layout')
  } else {
    message.error('登录失败')
  }
}
</script>

<template>
  <div class="login-panel">
    <n-card title="管理后台登录">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号"></n-input>
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input v-model:value="admin.password" placeholder="请输入密码" type="password"></n-input>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-checkbox v-model:checked="admin.rember" label="记住我"></n-checkbox>
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
