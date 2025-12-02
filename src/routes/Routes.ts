import { createWebHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import Perfil from '../pages/Perfil.vue'

import ProdutoAdicionar from '../pages/ProdutoAdicionar.vue'
import Pagamento from '../pages/Pagamento.vue'
import Cartao from '../pages/Cartao.vue'
import PerfilVisual from '../pages/perfilVisual.vue'
import Produto from '../pages/produto.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/perfil', component: Perfil },
  { path: '/produtoCriar', component: ProdutoAdicionar },
  { path: '/pagamento', component: Pagamento },
  { path: '/cartao', component: Cartao },
  { path: '/perfilVisual/:id', component: PerfilVisual },
  { path: '/produto/:id', component: Produto },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router