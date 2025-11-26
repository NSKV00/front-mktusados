<template>
  <v-app-bar class="header" style=".header" color="white" height="60">
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
  </v-app-bar>

  <main class="home" style="margin-top: 60px">
    
    <div class="cart-button"/>
    
   
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
                <h3>Nome:{{ product.nome }}</h3>
                <p class="price">R$ {{ product.valor }}</p>
                <p class="categoria">categoria: {{ product.categoria }}</p>
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
    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZXJuYXJkb3JhYnVza2U2N0BnbWFpbC5jb20iLCJpZCI6IjEzIiwibm9tZSI6IkJlcm5hcmRvIFJhYnVza2UiLCJhZG1pbiI6IkZhbHNlIiwibmJmIjoxNzYzNTA2MTkwLCJleHAiOjE3NjM1MTMzOTAsImlhdCI6MTc2MzUwNjE5MH0.5b3O_0BkVCfOZBBE4iGLFxGAPESTucVSqfr0O2Q9fgI`,
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
.header {
  position: absolute !important;
}

.header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(40deg, #372b73, #FF6B6B, #372b73);
}

.home {
  background-color: #f5f5f5;
  min-height: 100vh;
  position: relative;
}
.cart-button {
  position:absolute;
  top: 15px;   
  right: 20px;
  z-index: 999;
}

.products {
  padding: 2rem 1rem;
}
.product-card h3,
.product-card .price,
.product-card .categoria {
  margin-left: 0;
  text-align: left;
}
.product-card {
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 18px;
  padding: 2rem 2rem;
  background-color: #ffffff;
  color: #000;
  box-shadow: 0 8px 20px #00000022;
  height: 340px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(204, 0, 255, 0.441);
}
.price {
  font-size: 1.2rem;
  color: #fcca00;
  font-weight: 600;
  margin-top: 0.5rem;
}
</style>

<!-- <template>
  <v-container fluid class="fill-height d-flex flex-column align-center justify-center bg-white text-center text-black">
    <v-icon size="80" class="mb-4">mdi-home</v-icon>
    <h1 class="text-h4 font-weight-bold mb-2">Bem-vindo ao MKT Usados</h1>
    <p class="text-subtitle-1 mb-6">
      A melhor plataforma para compra e venda de produtos usados com segurança e praticidade.
    </p>

    <v-btn color="blue-grey-lighten-4" class="text-blue-darken-4 mb-3" @click="$router.push('/cadastro')">
      Criar conta
    </v-btn>

    <v-btn variant="outlined" color="white" @click="$router.push('/login')">
      Já tenho uma conta
    </v-btn>

    <v-main>
      <v-container class="products">
        <v-row>
          <v-col
            v-for="(product, index) in produtosFiltrados"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="product-card">
              <v-img :src="product.img" height="180px" />
              <v-card-text>
                <h3>{{ product.nome }}</h3>
                <p class="price">R$ {{ product.valor }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import emitter from '../utils/emitter'
import api from '../controller/api'

const products = ref<any[]>([])
const produtosFiltrados = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await api.get('/produto')
    products.value = res.data
    produtosFiltrados.value = res.data
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  }

  emitter.on('applyFilters', (filters) => {
    const searchTerm = filters.search?.toLowerCase() || ''
    //const categoryTerm = filters.
    //const priceTerm = 
    //consy ordenacaoTerm = 

    produtosFiltrados.value = products.value.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm)
    )
  })
})

onUnmounted(() => {
  emitter.all.clear()
})
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
 -->
