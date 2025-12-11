<template>
  <div v-if="isCarregando === true" class="ml-loading">
    <div class="loader"></div>
  </div>
  <div v-else class="container">
    <h2 class="title">Minhas Compras</h2>
    <p class="subtitle">Visualize e acompanhe todos os seus pedidos</p>

    <div class="filters">
      <select v-model="sortType" class="filter-select">
        <option value="recent">Mais recentes</option>
        <option value="barato">Mais barato</option>
        <option value="caro">Mais caro</option>
      </select>
    </div>

    <div class="grid-layout">
      <div v-for="card in paginatedCards" :key="card.id" class="card">
        <div class="card-header">
          <p class="order-id">Pedido #{{ card.id }}</p>
          <span class="status">Aprovado</span>
        </div>

        <p class="order-date">{{ card.date }}</p>

        <div v-for="item in card.items" :key="item.name" class="item">
          <div class="item-left">
            <img :src="item.img" />
            <p class="item-name">{{ item.name }}</p>
          </div>
          <p class="item-price">R$ {{ item.price }}</p>
        </div>

        <div class="total-line"></div>

        <div class="total">
          <p>Total da compra</p>
          <p>R$ {{ card.total }}</p>
        </div>

        <button class="btn-details" @click="openModal(card)">
          Ver detalhes ➜
        </button>
      </div>
    </div>

    <div class="pagination">
      <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
        ◀ Anterior
      </button>

      <p>Página {{ currentPage }} de {{ totalPages }}</p>

      <button class="page-btn next" @click="nextPage" :disabled="currentPage === totalPages">
        Próximo ▶
      </button>
    </div>
    <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
  <div class="modal-content" @click.stop>
    <h3>Detalhes do Pedido #{{ selectedOrder.id }}</h3>

    <p class="modal-date">Data: {{ selectedOrder.date }}</p>

    <div class="modal-items">
      <div v-for="item in selectedOrder.items" :key="item.name" class="modal-item">
        <img :src="item.img" />
        <div class="modal-info">
          <p class="modal-name">{{ item.name }}</p>
          <p class="modal-price">R$ {{ item.price }}</p>
        </div>
      </div>
    </div>

    <div class="modal-total">
      <p>Total da compra:</p>
      <p>R$ {{ selectedOrder.total }}</p>
    </div>

    <button class="modal-close" @click="closeModal">Fechar</button>
  </div>
</div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '../controller/api';
import { jwtDecode } from 'jwt-decode';

const tokenLocal = localStorage.getItem("token") || "";
const token = ref(tokenLocal);
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null);

const cards = ref([]);
const sortType = ref("recent");
const currentPage = ref(1);
const itemsPerPage = 12;
const isCarregando = ref(true)

onMounted(async () => {
  const res = await api.get(`/historico/aprovadas/${user.value.id}`);

  cards.value = res.data.map(pag => ({
    id: pag.ordem.ordemId,
    date: new Date(pag.dataPagamento).toLocaleDateString("pt-BR"),
    total: pag.ordem.total,
    items: pag.ordem.itens.map(item => ({
      name: item.produto.nome,
      price: item.subtotal,
      img: `data:image/jpeg;base64,${item.produto.img}`
    }))
  }));

  isCarregando.value = false

});

const sortedCards = computed(() => {
  let sorted = [...cards.value];

  switch (sortType.value) {
    case "recent":
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "barato":
      sorted.sort((a, b) => a.total - b.total);
      break;
    case "caro":
      sorted.sort((a, b) => b.total - a.total);
      break;
  }

  return sorted;
});

const selectedOrder = ref(null);

const openModal = (card) => {
  selectedOrder.value = card;
  document.body.style.overflow = "hidden"; // trava scroll
};

const closeModal = () => {
  selectedOrder.value = null;
  document.body.style.overflow = "auto"; 
};

const totalPages = computed(() => Math.ceil(sortedCards.value.length / itemsPerPage));

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedCards.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<style>
body {
  font-family: "Inter", sans-serif;
  background: #f6f7fb;
}

.container {
  padding: 40px;
  max-width: 1400px;
  margin: auto;
}

.title {
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 24px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-weight: 600;
}

.status {
  background: #e5f8e8;
  color: #1aa84b;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.order-date {
  color: #9ca3af;
  font-size: 14px;
  margin: 8px 0 16px;
}

.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
}

.item-name {
  font-size: 14px;
  color: #374151;
}

.item-price {
  font-weight: 600;
}

.total-line {
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}

.total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 16px;
}

.btn-details {
  width: 100%;
  background: #0f172a;
  color: white;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: 0.2s;
}

.btn-details:hover {
  background: #1e293b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.modal-content h3 {
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 700;
}

.modal-date {
  color: #6b7280;
  margin-bottom: 20px;
}

.modal-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.modal-item {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  align-items: center;
}

.modal-item img {
  width: 52px;
  height: 52px;
  border-radius: 8px;
}

.modal-name {
  font-size: 15px;
  font-weight: 500;
}

.modal-price {
  font-weight: 600;
  color: #0f172a;
}

.modal-total {
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 700;
  margin-top: 10px;
}

.modal-close {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #0f172a;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.modal-close:hover {
  background: #1e293b;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.page-btn {
  background: #0f172a;
  color: white;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
}

.filters {
  display: flex;
  justify-content: flex-end;
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

.filter-select {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 1400px) {
  .container {
    padding: 30px;
  }
  .title {
    font-size: 24px;
  }
  .card {
    padding: 20px;
  }
}

@media (max-width: 1100px) {
  .grid-layout {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  .item-name {
    font-size: 13px;
  }
  .btn-details {
    padding: 10px;
  }
}

@media (max-width: 900px) {
  .container {
    padding: 25px;
  }

  .filters {
    justify-content: center;
  }

  .filter-select {
    width: 60%;
  }

  .title {
    text-align: center;
    font-size: 22px;
  }

  .subtitle {
    text-align: center;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 18px;
  }

  .card {
    padding: 18px;
  }

  .item img {
    width: 38px;
    height: 38px;
  }

  .item-name {
    font-size: 12px;
  }

  .btn-details {
    font-size: 14px;
  }

  .filter-select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 14px;
  }

  .title {
    font-size: 20px;
  }

  .card {
    padding: 14px;
  }

  .item img {
    width: 32px;
    height: 32px;
  }

  .item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .item-price {
    align-self: flex-end;
  }

  .btn-details {
    font-size: 13px;
    padding: 10px;
  }
}

</style>