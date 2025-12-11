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
import Teste from '../pages/teste.vue'
import Bloqueado from '../pages/bloqueado.vue'
import Dashboard from '../pages/dashboard.vue'
import Endereco from '../pages/Endereco.vue'
import HistoricoCompra from '../pages/HistoricoCompra.vue'
import Admin from '../pages/admin.vue'
import NaoEncontrada from '../pages/naoEncontrada.vue'
import ProdutoNaoEncontrado from '../pages/produtoNaoEncontrado.vue'
import PerfilNaoEncontrado from '../pages/perfilNaoEncontrado.vue'
import SemPermisao from '../pages/semPermisao.vue'
import { jwtDecode } from 'jwt-decode'
import api from '../controller/api'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/perfil', component: Perfil, meta: { requiresAuth: true, isAtivo: true } },
  { path: '/produtoCriar', component: ProdutoAdicionar, meta: { requiresAuth: true, isAtivo: true } },
  { path: '/pagamento', component: Pagamento, meta: { requiresAuth: true, isAtivo: true, isEndereco: true } },
  { path: '/cartao', component: Cartao , meta: { requiresAuth: true, isAtivo: true }},
  { path: '/perfilVisual/:id', component: PerfilVisual , meta: { requiresAuth: true, isAtivo: true }},
  { path: '/produto/:id', component: Produto , meta: { requiresAuth: true, isAtivo: true }},
  { path: '/teste', component: Teste},
  { path: '/bloqueado', component: Bloqueado},
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true, isAtivo: true }},
  { path: "/enderecos", component: Endereco, meta: { requiresAuth: true, isAtivo: true } },
  { path: "/historico", component: HistoricoCompra, meta: { requiresAuth: true, isAtivo: true } },
  { path: "/admin", component: Admin, meta: { requiresAuth: true, isAdmin: true } },
  { path: "/404", component: NaoEncontrada },
  { path: "/produto404", component: ProdutoNaoEncontrado, meta: { requiresAuth: true , isAtivo: true} },
  { path: "/perfilNaoEncontrado", component: PerfilNaoEncontrado, meta: { requiresAuth: true , isAtivo: true} },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NaoEncontrada },
  { path: '/semPermisao', name: 'semPermisao', component: SemPermisao }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

interface UsuarioToken {
  id: number;
}

router.beforeEach(async (to, __from, next) => {
  const token = localStorage.getItem("token")
  
 
  if (to.meta.requiresAuth && !token) {
    return next("/login")
  }

  if (to.meta.adminOnly) {
    try {
      const usuario = jwtDecode<UsuarioToken>(token!)
      const res = await api.get(`/usuarios?Id=${usuario.id}`)
      console.log(res.data)
      const isAdmin = res.data[0].admin

      if (!isAdmin) {
        return next("/semPermisao")
      }
    } catch (e) {
      return next("/login") 
    }
  }

  if(to.meta.isAtivo) {
    try {
      const usuario = jwtDecode<UsuarioToken>(token!)
      const res = await api.get(`/usuarios?Id=${usuario.id}`)
      console.log(res.data)
      const isAtivo2 = res.data[0].ativo

      if (!isAtivo2) {
        return next("/bloqueado")
      }
    } catch (e) {
      return next("/login") 
    }
  }

if (to.meta.isEndereco) {
  try {
    const usuario = jwtDecode<UsuarioToken>(token!)
    await api.get(`/endereco-principal/${usuario.id}`)

    return next()
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
      return next("/enderecos")
    }
    return next("/login")
  }
}

  next()
})

export default router