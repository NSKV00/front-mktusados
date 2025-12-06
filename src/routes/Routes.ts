import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Cadastro from "../pages/Cadastro.vue";

import Perfil from "../pages/Perfil.vue";
import ProdutoAdicionar from "../pages/ProdutoAdicionar.vue";
import DetalhesProdutos from "../pages/DetalhesProdutos.vue";
import Pagamento from "../pages/Pagamento.vue";
import Cartao from "../pages/Cartao.vue";
import PerfilVisual from "../pages/PerfilVisual.vue";
import Produto from "../pages/produto.vue";
import Endereco from "../pages/Endereco.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/cadastro", component: Cadastro },

  { path: "/perfil", component: Perfil, meta: { requiresAuth: true } },
  { path: "/produtoCriar", component: ProdutoAdicionar, meta: { requiresAuth: true } },
  { path: "/pagamento", component: Pagamento, meta: { requiresAuth: true } },
  { path: "/cartao", component: Cartao, meta: { requiresAuth: true } },
  { path: "/perfilVisual/:id", component: PerfilVisual, meta: { requiresAuth: true } },
  { path: "/produto/:id", component: Produto, meta: { requiresAuth: true } },
  { path: "/produtos/:id", name: "DetalhesProdutos", component: DetalhesProdutos, meta: { requiresAuth: true } },
  { path: "/enderecos", component: Endereco, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("token");
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth);

  if (requiresAuth && !token) return next("/login");

  if (to.path === "/login" && token) return next("/");

  next();
});

export default router;
