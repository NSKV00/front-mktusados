import { createWebHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import DetalhesProdutos from '../pages/DetalhesProdutos.vue' 

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  {
    path: '/product/:name', 
    name: 'DetalhesProdutos',
    component: DetalhesProdutos,
    props: true, 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
