// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/accept',
    name: 'AcceptPayment',
    component: () => import(/* webpackChunkName: "home" */ '@/views/AcceptPayment.vue'),
  },
  {
    path: '/api',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/HomePage.vue'),
  },
  {
    path: '/status',
    name: 'Status',
    component: () => import(/* webpackChunkName: "home" */ '@/views/StatusPayment.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
