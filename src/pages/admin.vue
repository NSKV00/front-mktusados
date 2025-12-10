<template>
  <div class="dashboard">

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
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in paginated" :key="u.id">
          <td>{{ u.nome }}</td>
          <td><span class="icon">📧</span> {{ u.email }}</td>
          <td>
            <span
              class="status"
              :class="u.status === 'Ativo' ? 'status-ativo' : 'status-inativo'"
            >
              {{ u.status }}
            </span>
          </td>
          <td>
            <span
              class="badge"
              :class="u.funcao === 'Admin' ? 'badge-admin' : 'badge-user'"
            >{{ u.funcao }}</span>
          </td>
            <td class="tdBtn">
              <button
                class="btn-action btn-orange"
                v-if="u.funcao === 'Admin'"
                @click="abrirModal(
                  u.id,
                  'Remover Admin',
                  'Tem certeza que deseja remover o cargo de Admin deste usuário?',
                  removerAdmin
                )"
                >
                  Remover Admin
              </button>
              <button
                class="btn-action btn-purple"
                v-else
                @click="abrirModal(
                  u.id,
                  'Conceder Admin',
                  'Tem certeza que deseja conceder Admin para este usuário?',
                  concederAdmin
                )"
              >
                Conceder Admin
              </button>
              <button
                class="btn-action btn-orange"
                v-if="u.status === 'Ativo'"
                @click="abrirModal(
                  u.id,
                  'Inativar Usuário',
                  'Deseja realmente inativar este usuário?',
                  inativarUsuario
                )"
              >
                Inativar
              </button>
              <button
                class="btn-action btn-purple"
                v-else
                @click="abrirModal(
                  u.id,
                  'Ativar Usuário',
                  'Deseja ativar este usuário?',
                  ativarUsuario
                )"
              >
                Ativar
              </button>
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

    <div v-if="tab === 'produtos'">
      <div class="toolbar">
        <input
          v-model="buscaProduto"
          class="input"
          placeholder="Buscar por produto, vendedor ou categoria..."
        />

        <select v-model="filtroCategoria" class="select">
          <option value="Todos">Todas categorias</option>
          <option
            v-for="c in categoriasUnicas"
            :key="c"
            :value="c"
          >{{ c }}</option>
        </select>

        <select v-model="filtroStatusProduto" class="select">
          <option value="Todos">Todos</option>
          <option value="Ativo">Ativos</option>
          <option value="Inativo">Inativos</option>
        </select>

        <span class="total">Total: {{ produtosFiltrados.length }} produtos</span>
      </div>

      <table>
        <thead>
        <tr>
          <th>Produto</th>
          <th>Usuario</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in paginatedProdutos" :key="p.produto">
          <td>{{ p.produto }}</td>
          <td>{{ p.usuario }}</td> 
          <td><span class="tag">{{ p.categoria }}</span></td>
          <td><span class="price">R$ {{ p.preco }}</span></td>
          <td>
            <span
              class="status"
              :class="p.status === 'Ativo' ? 'status-ativo' : 'status-inativo'"
            >{{ p.status }}</span>
          </td>
          <td>
            <button
              class="btn-action"
              :class="p.status === 'Ativo' ? 'btn-orange' : 'btn-purple'"
              @click="abrirModal(
                p.id,
                p.status === 'Ativo' ? 'Inativar Produto' : 'Ativar Produto',
                p.status === 'Ativo'
                  ? 'Deseja realmente inativar este produto?'
                  : 'Deseja ativar este produto?',
                p.status === 'Ativo' ? inativarProduto : ativarProduto
              )"
            >
              {{ p.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>


      <div class="pagination">
        <button @click="prevPageProdutos" :disabled="currentPageProdutos === 1">
          ‹ Anterior
        </button>

        <button
          v-for="p in pagesProdutos"
          :key="p"
          :disabled="p === '...'"
          @click="p !== '...' ? currentPageProdutos = p : null"
          :class="{ active: currentPageProdutos === p }"
        >
          {{ p }}
        </button>

        <button @click="nextPageProdutos" :disabled="currentPageProdutos === totalPagesProdutos">
          Próxima ›
        </button>
      </div>
    </div>

    <div v-if="tab === 'compras'">
      <div class="toolbar">
        <input
          v-model="buscaCompras"
          class="input"
          placeholder="Buscar por pedido, usuário ou produto..."
        />

        <select v-model="filtroStatusCompra" class="select">
          <option value="Todos">Todos os status</option>
          <option value="Concluída">Concluída</option>
          <option value="Pendente">Pendente</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <span class="total">Total: {{ comprasFiltradas.length }} compras</span>
      </div>


      <table>
        <thead>
        <tr>
          <th>Pedido</th>
          <th>Usuario</th>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Valor Total</th>
          <th>Data</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="c in paginatedCompras" :key="c.pedido + '-' + c.produto">
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
                'status-pendente': c.status === 'Pendente'
              }"
            >{{ c.status }}</span>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="prevPageCompras" :disabled="currentPageCompras === 1">
          ‹ Anterior
        </button>

        <button
          v-for="p in pagesCompras"
          :key="p"
          :disabled="p === '...'"
          @click="p !== '...' ? currentPageCompras = p : null"
          :class="{ active: currentPageCompras === p }"
        >
          {{ p }}
        </button>

        <button @click="nextPageCompras" :disabled="currentPageCompras === totalPagesCompras">
          Próxima ›
        </button>
      </div>
    </div>

  </div>
  <div v-if="showModal" class="modal-overlay">
  <div class="modal">
    <h3 class="modal-title">{{ modalTitulo }}</h3>
    <p class="modal-text">{{ modalMensagem }}</p>

    <div class="modal-actions">
      <button class="btn-cancel" @click="showModal = false">Cancelar</button>
      <button class="btn-confirm" @click="confirmarAcao">Confirmar</button>
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
const showModal = ref(false)
const modalTitulo = ref("")
const modalMensagem = ref("")
const modalAcao = ref(null)
let usuarioSelecionadoId = null
const buscaProduto = ref("")
const filtroCategoria = ref("Todos")
const filtroStatusProduto = ref("Todos")
const currentPageProdutos = ref(1)
const itemsPerPageProdutos = 10
const buscaCompras = ref("")
const filtroStatusCompra = ref("Todos")
const currentPageCompras = ref(1)
const itemsPerPageCompras = 10

const produtos = ref([])

const compras = ref([]);

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

const categoriasUnicas = computed(() => {
  const set = new Set(produtos.value.map(p => p.categoria))
  return Array.from(set)
})

const paginated = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return usuariosFiltrados.value.slice(start, start + itemsPerPage)
})

const abrirModal = (id, titulo, mensagem, acao) => {
  usuarioSelecionadoId = id
  modalTitulo.value = titulo
  modalMensagem.value = mensagem
  modalAcao.value = acao
  showModal.value = true
}

const totalPages = computed(() =>
  Math.ceil(usuariosFiltrados.value.length / itemsPerPage)
)

const carregarUsuarios = async () => {
  const res = await api.get("/usuarios")

  usuarios.value = res.data.map(u => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    funcao: u.admin ? "Admin" : "Usuário",
    status: u.ativo ? "Ativo" : "Inativo"
  }))
}

const confirmarAcao = async () => {
  if (modalAcao.value) {
    await modalAcao.value(usuarioSelecionadoId)
  }
  showModal.value = false
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
    
    await carregarCompras()
    

    await carregarProdutos()
  } catch (e) {
    console.error("Erro ao carregar usuários:", e)
  }
})

const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => {
    const busca = buscaProduto.value.toLowerCase()

    const matchBusca =
      p.produto.toLowerCase().includes(busca) ||
      p.usuario.toLowerCase().includes(busca) ||   
      p.categoria.toLowerCase().includes(busca)

    const matchCategoria =
      filtroCategoria.value === "Todos" ||
      p.categoria === filtroCategoria.value

    const matchStatus =
      filtroStatusProduto.value === "Todos" ||
      p.status === filtroStatusProduto.value

    return matchBusca && matchCategoria && matchStatus
  })
})

const paginatedProdutos = computed(() => {
  const start = (currentPageProdutos.value - 1) * itemsPerPageProdutos
  return produtosFiltrados.value.slice(start, start + itemsPerPageProdutos)
})

const totalPagesProdutos = computed(() =>
  Math.ceil(produtosFiltrados.value.length / itemsPerPageProdutos)
)

const pagesProdutos = computed(() => {
  const total = totalPagesProdutos.value
  const current = currentPageProdutos.value
  const maxVisible = 5

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []
  pages.push(1)

  if (current > 3) pages.push("...")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let p = start; p <= end; p++) pages.push(p)

  if (current < total - 2) pages.push("...")

  pages.push(total)

  return pages
})

const nextPageProdutos = () => {
  if (currentPageProdutos.value < totalPagesProdutos.value) {
    currentPageProdutos.value++
  }
}

const prevPageProdutos = () => {
  if (currentPageProdutos.value > 1) {
    currentPageProdutos.value--
  }
}

const inativarProduto = async (id) => {
  await atualizarProduto(id, { Ativo: false })
}

const ativarProduto = async (id) => {
  await atualizarProduto(id, { Ativo: true })
}

const atualizarProduto = async (id, data) => {
  try {
    const res = await api.patch(`/produto/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    await carregarProdutos()
  } catch (err) {
    console.error(err)
  }
}

const carregarProdutos = async () => {
  const res2 = await api.get("/produto")

  produtos.value = res2.data.map(p => ({
    id: p.id,
    produto: p.nome,
    usuario: p.usuarioNome,
    categoria: p.categoriaNome,
    preco: p.valor.toFixed(2).replace(".", ","),
    status: p.ativo ? "Ativo" : "Inativo"
  }))
}

const carregarCompras = async () => {
  try {
    const res = await api.get("/historico/todos");
    const linhas = []

    res.data.forEach(pag => {
      const ordem = pag.ordem
      ordem.itens.forEach(item => {
        const usuario = usuarios.value.find(u => u.id === ordem.usuarioId)
        const nomeUsuario = usuario ? usuario.nome : `ID: ${ordem.usuarioId}`

        linhas.push({
          pedido: `ORD-${pag.pagamentoId}`,
          usuario: nomeUsuario, 
          produto: item.produto.nome,
          quantidade: item.qtd,
          valor: item.subtotal.toFixed(2).replace(".", ","), 
          data: new Date(pag.dataPagamento).toLocaleDateString("pt-BR"),
          status: pag.statusPagamento === "approved" ? "Concluída" : "Pendente"
        })
      })
    })

    compras.value = linhas
  } catch (err) {
    console.error("Erro ao carregar compras:", err)
  }
}


const comprasFiltradas = computed(() => {
  return compras.value.filter(c => {
    const busca = buscaCompras.value.toLowerCase()
    const matchBusca =
      c.pedido.toLowerCase().includes(busca) ||
      c.usuario.toLowerCase().includes(busca) ||
      c.produto.toLowerCase().includes(busca)

    const matchStatus =
      filtroStatusCompra.value === "Todos" ||
      c.status === filtroStatusCompra.value

    return matchBusca && matchStatus
  })
})

const paginatedCompras = computed(() => {
  const start = (currentPageCompras.value - 1) * itemsPerPageCompras
  return comprasFiltradas.value.slice(start, start + itemsPerPageCompras)
})

const totalPagesCompras = computed(() =>
  Math.ceil(comprasFiltradas.value.length / itemsPerPageCompras)
)

const pagesCompras = computed(() => {
  const total = totalPagesCompras.value
  const current = currentPageCompras.value
  const maxVisible = 5

  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = [1]
  if (current > 3) pages.push("...")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let p = start; p <= end; p++) pages.push(p)

  if (current < total - 2) pages.push("...")
  pages.push(total)

  return pages
})

const nextPageCompras = () => {
  if (currentPageCompras.value < totalPagesCompras.value) currentPageCompras.value++
}

const prevPageCompras = () => {
  if (currentPageCompras.value > 1) currentPageCompras.value--
}

</script>

<style scoped>
.dashboard {
  padding: 32px;
  font-family: "Inter", sans-serif;
  background: #f3f4f6;
  color: #1f2937;
}

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

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

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

.btn-purple {
  background: #7C3AED15;
  color: #6D28D9;
  border: 1px solid #7C3AED40;
}

.btn-purple:hover {
  background: #7C3AED25;
  transform: translateY(-1px);
}

.btn-orange {
  background: #F9731615;
  color: #C2410C;
  border: 1px solid #F9731640;
}

.btn-orange:hover {
  background: #F9731625;
  transform: translateY(-1px);
}

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

.select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background: white url("data:image/svg+xml;utf8,<svg fill='gray' height='16' width='16' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><polygon points='5,7 15,7 10,13'/></svg>")
    no-repeat right 12px center;
  
  padding: 10px 40px 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.select:hover {
  border-color: #9ca3af;
}

.select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
  outline: none;
}

.select:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 24px;
  width: 420px;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  text-align: center;
  animation: pop 0.2s ease;
}

@keyframes pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 22px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn-cancel {
  padding: 10px 18px;
  background: #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-confirm {
  padding: 10px 18px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm:hover {
  background: #1d4ed8;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

table th,
table td {
  text-align: left !important;
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

.users-table th:nth-child(1), 
.users-table td:nth-child(1) {
  width: 200px;  
}

.users-table th:nth-child(2), 
.users-table td:nth-child(2) {
  width: 280px;   
}

.users-table th:nth-child(3), 
.users-table td:nth-child(3) {
  width: 120px;  
}

.users-table th:nth-child(4), 
.users-table td:nth-child(4) {
  width: 180px;  
}

.users-table th:nth-child(5), 
.users-table td:nth-child(5) {
  width: 260px;  
}

.users-table td,
.users-table th {
  text-align: left;
  vertical-align: middle;
}

.email-cell,
.name-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.acoes {
  display: flex;
  gap: 8px;
}

.tdBtn {
  display: flex;
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

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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