import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('@/views/Detail.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/views/layout/LayoutView.vue'),
      children: [
        {
          path: '/layout/category',
          name: 'category',
          component: () => import('@/views/layout/CategoryView.vue'),
        },
        {
          path: '/layout/article',
          name: 'article',
          component: () => import('@/views/layout/ArticleView.vue'),
        },
      ],
    },
  ],
})

export default router
