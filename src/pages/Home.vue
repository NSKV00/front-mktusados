<template>
  <main class="home">
    
    <div class="cart-button">
      <v-btn icon @click="carrinhoDrawer = true">
        <v-icon>mdi-cart</v-icon>
        <v-badge
          v-if="carrinho.length > 0"
          :content="carrinho.length"
          color="deep-purple-accent-4"
          offset-x="10"
          offset-y="10"
        />
      </v-btn>
    </div>

   
    <Carrinho
      v-model:aberto="carrinhoDrawer"
      :carrinho="carrinho"
      :produtos="products"
      @remover="removerCarrinho"
      @finalizar="() => console.log('Compra finalizada!')"
    />

   
    <section class="products">
      <v-container>
        <v-row>
          <v-col
            v-for="(product, index) in sortedProducts"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="product-card" @click="goToDetails(product)">
              <v-img :src="product.img" height="180px" />
              <v-card-text>
                <h3>{{ product.nome }}</h3>
                <p class="price">R$ {{ product.valor }}</p>
                <p class="categoria">{{ product.categoria }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiController from "../controller/api";
import Carrinho from "../components/carrinho.vue";

interface Product {
  id: number;
  nome: string;
  description: string;
  categoria: string;
  valor: number;
  img: string;
}

interface CarrinhoItem {
  id: number;
  produtoId: number;
  qtd: number;
  usuarioId: number;
}

const router = useRouter();
const usuarioId = 1;
const carrinhoDrawer = ref(false);

const products = ref<Product[]>([]);
const carrinho = ref<CarrinhoItem[]>([]);

const apiProduto = "/produto";
const apiCarrinho = "/itemCarrinho";

const headers = {
  Authorization:
    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjE2NzY4NDgsImV4cCI6MTc2MTY4NDA0OCwiaWF0IjoxNzYxNjc2ODQ4fQ.3c6wxkAER2svWMW9zv4orijhpBs81l5KKb7MtZ5Gn80`,
};


async function carregarCarrinhoEProdutos() {
  try {
    const resProdutos = await apiController.get(apiProduto, { headers });
    products.value = resProdutos.data;

    const resCarrinho = await apiController.get(apiCarrinho, {
      params: { usuarioId },
      headers,
    });
    carrinho.value = resCarrinho.data;
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
}


async function adicionarCarrinho(productId: number) {
  const existente = carrinho.value.find((i) => i.produtoId === productId);

  try {
    if (existente) {
      const atualizado = await apiController.patch(
        `${apiCarrinho}/${existente.id}`,
        { qtd: existente.qtd + 1 },
        { headers }
      );
      existente.qtd = atualizado.data.qtd;
    } else {
      const novoItem = await apiController.post(
        apiCarrinho,
        { produtoId: productId, qtd: 1, usuarioId },
        { headers }
      );
      carrinho.value.push(novoItem.data);
    }
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
  }
}

async function removerCarrinho(index: number) {
  const item = carrinho.value[index];
  if (!item) return;
  try {
    await apiController.delete(`${apiCarrinho}/${item.id}`, { headers });
    carrinho.value.splice(index, 1);
  } catch (err) {
    console.error("Erro ao remover item:", err);
  }
}

const sortedProducts = computed(() => {
  const list = [...products.value];
  return list.sort((a, b) => a.nome.localeCompare(b.nome));
});

const goToDetails = (produto: Product) => {
  router.push({
    name: "DetalhesProdutos",
    params: { id: produto.id.toString() },
  });
};

onMounted(() => carregarCarrinhoEProdutos());
</script>

<style scoped>
.home {
  background-color: #f5f5f5;
  min-height: 100vh;
  position: relative;
}
.cart-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 50;
}
.header {
  position: relative;
  top: 0;
  background-color: #f5f5f5;
  color: #ffaf04;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  box-shadow: 0 2px 4px #d100ff;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.logo-text {
  font-size: 2rem;
  font-weight: bold;
  margin-left: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  padding: 2rem;
}

.search-bar {
  min-width: 40%;
}

.filter-btn,
.carrinho-btn {
  height: 40px;
}

.filter-drawer {
  width: 280px;
  padding: 1rem;
}
.Categorias {
  gap: 12px;
}
.Ordenador {
  gap: 12px;
}

.carrinho-drawer {
  width: 350px;
  padding: 1rem;
}

.nav-drawer {
  width: 250px;
  padding: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-info h4 {
  margin: 0;
  font-size: 1rem;
}

.cart-info p {
  margin: 0;
  color: #00a650;
}

.cart-total {
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.products {
  padding: 2rem 1rem;
}


.product-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.price {
  font-size: 1.2rem;
  color: #00a650;
  font-weight: bold;
}
.empty-cart {
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style>