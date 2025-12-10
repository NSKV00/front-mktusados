<template>
  <div v-if="isCarregando === true" class="ml-loading">
    <div class="loader"></div>
  </div>
  <div v-else class="page-container">
    <div class="main-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total Faturado</p>
            <p class="stat-value">{{ totalFaturadoFormatted }}</p>
            <p class="stat-description">Total recebido em pagamentos aprovados</p>
          </div>
          <div class="stat-icon">💵</div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total de Vendas</p>
            <p class="stat-value">{{ dashboardData.totalVendas ?? 0 }}</p>
            <p class="stat-description">Pedidos aprovados</p>
          </div>
          <div class="stat-icon">🛒</div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">Total de Produtos</p>
            <p class="stat-value">{{ dashboardData.totalProdutos ?? 0 }}</p>
            <p class="stat-description">Produtos cadastrados</p>
          </div>
          <div class="stat-icon">📦</div>
        </div>
      </div>

      <div class="main-grid">
        <div class="card card-pedido">
          <h2 class="card-title">Último Pedido Aprovado</h2>
          <p class="pedido-numero">#ORD-{{ ultimoPedido.id ?? '' }}</p>

          <div class="pedido-details">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <div class="detail-text">
                  <p class="detail-label">Data</p>
                  <p class="detail-value">{{ ultimoPedidoDataFormatada }}</p>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-icon">👤</span>
                <div class="detail-text">
                  <p class="detail-label">Cliente</p>
                  <p class="detail-value">{{ usuario.nome }}</p>
                </div>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-icon">📦</span>
                <div class="detail-text">
                  <p class="detail-label">Itens</p>
                  <p class="detail-value">{{ itensLabel }}</p>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💰</span>
                <div class="detail-text">
                  <p class="detail-label">Valor Total</p>
                  <p class="detail-value">{{ ultimoPedidoValorFormatado }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="badge-status">Pagamento aprovado</div>
        </div>

        <div class="card card-produto">
          <div class="card-header-produto">
            <h2 class="card-title">Produto Mais Vendido</h2>
            <span class="badge-top">📈 Top</span>
          </div>

          <div class="produto-imagem">
            <img :src="produtoImgSrc" alt="Imagem produto" />
          </div>

          <h3 class="produto-nome">{{ produtoMaisVendido.nome ?? '' }}</h3>

          <div class="produto-stats">
            <div class="stat-row">
              <span class="stat-label-produto">Unidades vendidas</span>
              <span class="stat-value-produto">{{ produtoMaisVendido.qtdVendida ?? 0 }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label-produto">Valor unitário</span>
              <span class="stat-value-produto">{{ produtoValorFormatado }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label-produto">Receita gerada</span>
              <span class="stat-value-produto receita">{{ produtoReceitaFormatada }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '../controller/api';
import { jwtDecode } from 'jwt-decode';

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)

const dashboardData = ref({})
const usuario = ref({})
const isCarregando = ref(true)

onMounted(async () => {

  const iduser = Number(user.value.id)

  const res = await api.get(`/api/dashboard/${user.value.id}`)
  const res2 = await api.get("/usuarios",{
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    params: {
      id: iduser
    }
  })

  usuario.value = res2.data[0]
  dashboardData.value = res.data

  isCarregando.value = false
});

const formatCurrency = (v) => {
  const n = Number(v ?? 0)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

const totalFaturadoFormatted = computed(() => formatCurrency(dashboardData.value.totalFaturado))

const ultimoPedido = computed(() => dashboardData.value.ultimoPedido || {})
const ultimoPedidoValorFormatado = computed(() => formatCurrency(ultimoPedido.value.valorTotal))
const itensLabel = computed(() => {
  const n = Number(ultimoPedido.value.itens ?? 0)
  return `${n} item${n === 1 ? '' : 's'}`
})
const ultimoPedidoDataFormatada = computed(() => {
  if (!ultimoPedido.value?.dataPagamento) return ''
  const d = new Date(ultimoPedido.value.dataPagamento)
  const day = String(d.getDate()).padStart(2, '0')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${day} de ${months[d.getMonth()]}, ${d.getFullYear()}`
})

const produtoMaisVendido = computed(() => dashboardData.value.produtoMaisVendido || {})
const produtoValorFormatado = computed(() => formatCurrency(produtoMaisVendido.value.valor))
const produtoReceitaFormatada = computed(() => formatCurrency(produtoMaisVendido.value.receitaGerada))
const produtoImgSrc = computed(() => {
  const img = produtoMaisVendido.value.img
  if (!img) return 'https://via.placeholder.com/400x280?text=Sem+imagem'
  if (typeof img === 'string') {
    if (img.startsWith('data:')) return img
    return `data:image/png;base64,${img}`
  }
  return 'https://via.placeholder.com/400x280?text=Sem+imagem'
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-container {
  background: #f8f9fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  padding: 40px 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.stat-value-rating {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  font-size: 16px;
  letter-spacing: 2px;
}

.stat-description {
  font-size: 12px;
  color: #8a8a8a;
  line-height: 1.4;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.8;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.pedido-numero {
  font-size: 13px;
  color: #8a8a8a;
  font-weight: 600;
  margin-bottom: 24px;
}

.pedido-details {
  margin-bottom: 24px;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  gap: 12px;
}

.detail-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
}

.detail-text {
  flex: 1;
}

.detail-label {
  font-size: 12px;
  color: #8a8a8a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.badge-status {
  display: inline-block;
  background: #d4edda;
  color: #155724;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
}

  .ml-loading{
    min-height: 100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(180deg,#f7f8fa,#fbfbfd);
  }

  .loader{
    width:44px;
    height:44px;
    border-radius:50%;
    border:5px solid rgba(0,0,0,0.06);
    border-top-color:var(--ml-yellow);
    animation:spin .9s linear infinite;
  }

  @keyframes spin{ 
    to { transform:rotate(360deg);} 
  }

.btn-detalhes {
  width: 100%;
  padding: 14px 24px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-detalhes:hover {
  background: #0052cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

.card-header-produto {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badge-top {
  background: #e3f2fd;
  color: #0066ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.produto-imagem {
  width: 100%;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #f0f0f0;
}

.produto-imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.produto-nome {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.produto-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-label-produto {
  font-size: 13px;
  color: #8a8a8a;
  font-weight: 600;
}

.stat-value-produto {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.receita {
  color: #0066ff;
  font-size: 15px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: 20px 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    padding: 20px;
  }

  .card {
    padding: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .produto-imagem {
    height: 240px;
  }

  .btn-detalhes {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>