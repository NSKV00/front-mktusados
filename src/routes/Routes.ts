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
import Endereco from '../pages/Endereco.vue'

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
  { path: '/perfil', component: Perfil, meta: { requiresAuth: true } },
  { path: '/produtoCriar', component: ProdutoAdicionar, meta: { requiresAuth: true } },
  { path: '/enderecos', component: Endereco, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token")
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)

  // Se a rota requer autenticação e não há token
  if (requiresAuth && !token) {
    next('/login')
  }
  // Se está em login e tem token válido, redirecionar para home
  else if (to.path === '/login' && token) {
    next('/')
  }
  // Caso contrário, permitir navegação
  else {
    next()
  }
})

export default router