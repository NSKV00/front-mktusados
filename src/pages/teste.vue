<template>
  <div class="dashboard">

    <!-- NAV TABS -->
    <div class="tabs">
      <div
        class="tab"
        :class="{ active: tab === 'usuarios' }"
        @click="tab = 'usuarios'"
      >👤 Usuários</div>
      <div
        class="tab"
        :class="{ active: tab === 'produtos' }"
        @click="tab = 'produtos'"
      >🛍️ Produtos</div>
      <div
        class="tab"
        :class="{ active: tab === 'compras' }"
        @click="tab = 'compras'"
      >🛒 Compras</div>
    </div>

    <!-- CONTENT -->
    <div v-if="tab === 'usuarios'">
      <div class="toolbar">
        <input
          v-model="busca"
          class="input"
          placeholder="Buscar nome ou email..."
        />

        <select v-model="filtroStatus" class="select">
          <option>Todos</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>

        <select v-model="filtroFuncao" class="select">
          <option>Todos</option>
          <option>Admin</option>
          <option>Usuário</option>
        </select>

        <span class="total">Total: {{ usuariosFiltrados.length }} usuários</span>
      </div>

      <table>
        <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in paginated" :key="u.id">
          <td>{{ u.nome }}</td>
          <td><span class="icon">📧</span> {{ u.email }}</td>
          <td>
            <span
              class="badge"
              :class="u.funcao === 'Admin' ? 'badge-admin' : 'badge-user'"
            >{{ u.funcao }}</span>
          </td>
            <td class="tdBtn">
              <button class="btn-action btn-purple" v-if="u.funcao === 'Admin'" @click="concederAdmin(u.id)">Conceder Admin</button>
              <button class="btn-action btn-orange" v-else @click="removerAdmin(u.id)">Remover Admin</button>
              <button class="btn-action btn-orange" v-if="u.status === 'Ativo'" @click="inativarUsuario(u.id)">Inativar</button>
              <button class="btn-action btn-purple" v-else @click="ativarUsuario(u.id)">Ativar</button>
            </td>
        </tr>
        </tbody>
      </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        ‹ Anterior
      </button>

      <button
        v-for="p in pages"
        :key="p"
        :disabled="p === '...'"
        @click="p !== '...' ? currentPage = p : null"
        :class="{ active: currentPage === p }"
      >
        {{ p }}
      </button>

      <button @click="nextPage" :disabled="currentPage === totalPages">
        Próxima ›
      </button>
    </div>
    </div>


    <!-- PRODUTOS -->
    <div v-if="tab === 'produtos'">
      <div class="toolbar">
        <input class="input" placeholder="Buscar produtos..." />
        <span class="total">Total: 12 produtos</span>
      </div>

      <table>
        <thead>
        <tr>
          <th>Produto</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in produtos" :key="p.produto">
          <td>{{ p.produto }}</td>
          <td><span class="tag">{{ p.categoria }}</span></td>
          <td><span class="price">R$ {{ p.preco }}</span></td>
          <td><span class="estoque">{{ p.estoque }} unidades</span></td>
          <td>
            <span
              class="status"
              :class="p.status === 'Ativo' ? 'status-ativo' : 'status-inativo'"
            >{{ p.status }}</span>
          </td>
          <td class="acoes">
            <button
              v-if="p.status === 'Ativo'"
              class="btn danger">👁️ Inativar</button>
            <button
              v-else
              class="btn success">🟢 Ativar</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="footer">
        <span>Mostrando 1 a 10 de 12 resultados</span>
        <div class="pagination">
          <button disabled>‹ Anterior</button>
          <button class="active">1</button>
          <button>2</button>
          <button>Próxima ›</button>
        </div>
      </div>
    </div>


    <!-- COMPRAS -->
    <div v-if="tab === 'compras'">
      <div class="toolbar">
        <input class="input" placeholder="Buscar por pedido, usuário ou produto..." />
        <select class="select">
          <option>Todos os status</option>
        </select>
        <span class="total">Total: 12 compras</span>
      </div>

      <div class="receita">
        💲 Receita Total (Concluídas): <span class="valor">R$ 11.407,57</span>
      </div>

      <table>
        <thead>
        <tr>
          <th>Pedido</th>
          <th>Usuário</th>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Valor Total</th>
          <th>Data</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="c in compras" :key="c.pedido">
          <td>{{ c.pedido }}</td>
          <td>{{ c.usuario }}</td>
          <td>{{ c.produto }}</td>
          <td>{{ c.quantidade }}x</td>
          <td class="price">R$ {{ c.valor }}</td>
          <td>{{ c.data }}</td>
          <td>
            <span
              class="status"
              :class="{
                'status-ativo': c.status === 'Concluída',
                'status-pendente': c.status === 'Pendente',
                'status-inativo': c.status === 'Cancelada'
              }"
            >{{ c.status }}</span>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="footer">
        <span>Mostrando 1 a 10 de 12 resultados</span>
        <div class="pagination">
          <button disabled>‹ Anterior</button>
          <button class="active">1</button>
          <button>2</button>
          <button>Próxima ›</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../controller/api";

const tab = ref("usuarios");

const usuarios = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const busca = ref("")
const filtroStatus = ref("Todos")
const filtroFuncao = ref("Todos")

const produtos = ref([
  { produto: "Notebook Dell Inspiron 15", categoria: "Eletrônicos", preco: "3.499,99", estoque: 25, status: "Ativo" },
  { produto: "Mouse Logitech MX Master 3", categoria: "Periféricos", preco: "349,90", estoque: 50, status: "Ativo" },
  { produto: "Teclado Mecânico Keychron K2", categoria: "Periféricos", preco: "599,00", estoque: 0, status: "Inativo" },
  { produto: "Monitor LG UltraWide 29\"", categoria: "Monitores", preco: "1.899,99", estoque: 15, status: "Ativo" },
  { produto: "Webcam Logitech C920", categoria: "Periféricos", preco: "459,90", estoque: 30, status: "Ativo" },
  { produto: "Headset HyperX Cloud II", categoria: "Áudio", preco: "499,00", estoque: 12, status: "Inativo" },
  { produto: "SSD Samsung 1TB", categoria: "Armazenamento", preco: "549,90", estoque: 40, status: "Ativo" },
  { produto: "Mousepad Gamer RGB", categoria: "Periféricos", preco: "89,90", estoque: 60, status: "Ativo" },
  { produto: "Cadeira Gamer ThunderX3", categoria: "Mobiliário", preco: "1.299,00", estoque: 8, status: "Ativo" },
  { produto: "Microfone Blue Yeti", categoria: "Áudio", preco: "899,90", estoque: 15, status: "Ativo" }
]);

const compras = ref([
  { pedido: "ORD-001", usuario: "João Silva", produto: "Notebook Dell Inspiron 15", quantidade: 1, valor: "3.499,99", data: "14/04/2024", status: "Concluída" },
  { pedido: "ORD-002", usuario: "Maria Santos", produto: "Mouse Logitech MX Master 3", quantidade: 2, valor: "699,80", data: "15/04/2024", status: "Concluída" },
  { pedido: "ORD-003", usuario: "Pedro Oliveira", produto: "Monitor LG UltraWide 29\"", quantidade: 1, valor: "1.899,99", data: "16/04/2024", status: "Pendente" },
  { pedido: "ORD-004", usuario: "Ana Costa", produto: "Webcam Logitech C920", quantidade: 1, valor: "459,90", data: "17/04/2024", status: "Concluída" }
]);

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {

    const matchBusca =
      u.nome.toLowerCase().includes(busca.value.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.value.toLowerCase())

    const matchStatus =
      filtroStatus.value === "Todos" || u.status === filtroStatus.value

    const matchFuncao =
      filtroFuncao.value === "Todos" || u.funcao === filtroFuncao.value

    return matchBusca && matchStatus && matchFuncao
  })
})

const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return usuariosFiltrados.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() =>
  Math.ceil(usuariosFiltrados.value.length / itemsPerPage)
)

const carregarUsuarios = async () => {
  const res = await api.get("/usuarios")
  usuarios.value = res.data
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const concederAdmin = async (id) => {
  await atualizarUsuario(id, { admin: true })
}

const removerAdmin = async (id) => {
  await atualizarUsuario(id, { admin: false })
}

const inativarUsuario = async (id) => {
  await atualizarUsuario(id, { ativo: false })
}

const ativarUsuario = async (id) => {
  await atualizarUsuario(id, { ativo: true })
}

const atualizarUsuario = async (id, data) => {
  try {
    const res = await api.patch(`/usuarios/${id}`, data)
    await carregarUsuarios() 
    console.log("Atualizado:", res.data)
  } catch (err) {
    console.error(err)
  }
}

const pages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5


  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pagesArray = []


  pagesArray.push(1)

  if (current > 3) {
    pagesArray.push("...")
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let p = start; p <= end; p++) {
    pagesArray.push(p)
  }

  if (current < total - 2) {
    pagesArray.push("...")
  }

  pagesArray.push(total)

  return pagesArray
})


onMounted(async () => {
  try {
    const res = await api.get("/usuarios")

    usuarios.value = res.data.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      funcao: u.admin ? "Admin" : "Usuário",
      status: u.ativo ? "Ativo" : "Inativo"
    }))

  } catch (e) {
    console.error("Erro ao carregar usuários:", e)
  }
})

</script>

<style scoped>
.dashboard {
  padding: 32px;
  font-family: "Inter", sans-serif;
  background: #f3f4f6;
  color: #1f2937;
}

/* TABS */
.tabs {
  display: flex;
  gap: 28px;
  margin-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
}

.tab {
  padding: 14px 2px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: #6b7280;
  transition: 0.2s;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  color: #2563eb;
  border-bottom: 3px solid #2563eb;
}

/* SEARCH + FILTERS */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

/* BOTÕES PROFISSIONAIS */
.btn-action {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  min-width: 140px; 
}

/* ROXO — ativar / conceder admin */
.btn-purple {
  background: #7C3AED15;
  color: #6D28D9;
  border: 1px solid #7C3AED40;
}

.btn-purple:hover {
  background: #7C3AED25;
  transform: translateY(-1px);
}

/* LARANJA — inativar / remover admin */
.btn-orange {
  background: #F9731615;
  color: #C2410C;
  border: 1px solid #F9731640;
}

.btn-orange:hover {
  background: #F9731625;
  transform: translateY(-1px);
}

/* Desativado */
.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.input,
.select {
  background: white;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
}

/* CARD TABLE */
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

thead {
  background: #f9fafb;
}

th {
  text-align: left;
  padding: 14px 16px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

td {
  padding: 14px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}

/* TAG / BADGE */
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge-admin {
  background: #ede9fe;
  color: #5b21b6;
}

.badge-user {
  background: #f3f4f6;
  color: #374151;
}

/* STATUS */
.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-ativo {
  background: #dcfce7;
  color: #166534;
}

.status-inativo {
  background: #fee2e2;
  color: #991b1b;
}

.status-pendente {
  background: #fef9c3;
  color: #92400e;
}

.users-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Cada coluna com largura fixa */
.users-table th:nth-child(1), 
.users-table td:nth-child(1) {
  width: 200px;   /* Nome */
}

.users-table th:nth-child(2), 
.users-table td:nth-child(2) {
  width: 280px;   /* Email */
}

.users-table th:nth-child(3), 
.users-table td:nth-child(3) {
  width: 120px;   /* Função */
}

.users-table th:nth-child(4), 
.users-table td:nth-child(4) {
  width: 180px;   /* Status */
}

.users-table th:nth-child(5), 
.users-table td:nth-child(5) {
  width: 260px;   /* Ações */
}

/* Centralização vertical e horizontal */
.users-table td,
.users-table th {
  text-align: left;
  vertical-align: middle;
}

/* Ícone e texto alinhados */
.email-cell,
.name-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* BUTTONS */
.acoes {
  display: flex;
  gap: 8px;
}

.tdBtn {
  gap: 20px
}

.btn {
  padding: 7px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: 0.15s;
}

.btn:hover {
  transform: scale(1.03);
}

.pagination button.active {
  background: #83008f !important;
  color: white !important;
  border-color: #83008f  !important;
}

.btn.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.btn.neutral {
  background: #f3f4f6;
  color: #374151;
}

.btn.success {
  background: #dcfce7;
  color: #166534;
}

/* PRICE / INVENTORY */
.price {
  font-weight: 600;
  color: #166534;
}

.tag {
  padding: 4px 10px;
  border-radius: 12px;
  background: #e5e7eb;
  font-size: 12px;
}

.estoque {
  color: #6b7280;
}

/* FOOTER + PAGINATION */
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
}

.pagination {
  display: flex;
  gap: 6px;
}

.pagination button {
  padding: 7px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.pagination button:hover {
  background: #f3f4f6;
}

.pagination .active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* RECEITA */
.receita {
  padding: 12px 16px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  font-weight: 500;
  border-radius: 10px;
  margin-bottom: 16px;
}

.valor {
  font-weight: 700;
}

</style>
