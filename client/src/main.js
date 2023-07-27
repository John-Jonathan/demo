import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import axios from 'axios'
import './assets/main.scss'
import App from './App.vue'
import router from './router'

const { message, notification, dialog } = createDiscreteApi(['message', 'notification', 'dialog'])

const app = createApp(App)

// 访问路由的基本地址
axios.defaults.baseURL = 'http://127.0.0.1:4000'

app.provide('axios', axios)
app.provide('message', message)
app.provide('notification', notification)
app.provide('dialog', dialog)
app.provide('server_url', axios.defaults.baseURL)

app.use(createPinia())
app.use(router)
app.use(naive)

import { useAdminStore } from '@/stores/AdminStore.js'
const adminStore = useAdminStore()
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token
  return config
})

app.mount('#app')
