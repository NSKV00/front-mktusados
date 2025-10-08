import { createWebHistory, createRouter } from 'vue-router'

import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router