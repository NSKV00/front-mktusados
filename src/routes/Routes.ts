import { createWebHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import DetalhesProdutos from '../pages/DetalhesProdutos.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  { path: '/produtos/:id', name: 'DetalhesProdutos', component: DetalhesProdutos, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
