import { createWebHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import Perfil from '../pages/Perfil.vue'

import ProdutoAdicionar from '../pages/ProdutoAdicionar.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/perfil', component: Perfil },
  { path: '/produtoCriar', component: ProdutoAdicionar },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router