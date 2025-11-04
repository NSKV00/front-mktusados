<template>
  <main class="home">
    <v-btn icon @click="navDrawer = true">
      <v-icon>mdi-filter</v-icon>
    </v-btn>
    <v-navigation-drawer
      v-model="navDrawer"
      location="right"
      temporary
      class="nav-drawer"
    >
      <v-list>
  <v-list-item-title class="filter-title">Filtros</v-list-item-title>
  <v-divider />

  
  <v-text-field
    v-model.number="minPrice"
    label="Preço mínimo"
    type="number"
    prefix="R$"
    clearable
  />

  
  <v-text-field
    v-model.number="maxPrice"
    label="Preço máximo"
    type="number"
    prefix="R$"
    clearable
  />

  
  <v-select
    v-model="sortBy"
    :items="sortOptions"
    label="Ordenar por"
  />

  <v-btn block color="primary" class="mt-4" @click="filterDrawer = false">
    Aplicar
  </v-btn>
</v-list>

    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="carrinhoDrawer"
      location="right"
      temporary
      class="carrinho-drawer"
    >
      <v-list>
        <v-list-item-title class="drawer-title">Carrinho</v-list-item-title>
        <v-divider />
        <div v-if="carrinho.length === 0" class="empty-cart">
          Seu carrinho está vazio.
        </div>

        <v-list-item v-for="(item, index) in carrinho" :key="index">
          <v-img :src="item.image" width="60" height="60" class="mr-3" />
          <div class="cart-info">
            <h4>{{ item.name }}</h4>
            <p>R$ {{ item.price.toFixed(2) }}</p>
            <v-btn icon size="small" @click="removerCarrinho(index)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-list-item>

        <v-divider class="my-4" />
        <h3 class="cart-total">Total: R$ {{ cartTotal.toFixed(2) }}</h3>
        <v-btn
          block
          color="green"
          class="mt-3"
          :disabled="carrinho.length === 0"
          >Finalizar Compra</v-btn
        >
      </v-list>
    </v-navigation-drawer>

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

const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

interface Product {
  id: number;
  nome: string;
  description: string;
  price: number;
  image: string;
}

interface CarrinhoItem {
  id: number;
  produtoId: number;
  qtd: number;
  usuarioId: number;
}

const router = useRouter();
const usuarioId = 1;

const navDrawer = ref(false);
const filterDrawer = ref(false);
const carrinhoDrawer = ref(false);

const search = ref("");
const sortBy = ref("Padrão");
const sortOptions = ["Padrão", "Menor preço", "Maior preço", "Nome (A-Z)", "Nome (Z-A)"];



const products = ref<Product[]>([]);
const carrinho = ref<CarrinhoItem[]>([]);

const apiProduto = "/produto";
const apiCarrinho = "/itemCarrinho";

const headers = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjE2NzY4NDgsImV4cCI6MTc2MTY4NDA0OCwiaWF0IjoxNzYxNjc2ODQ4fQ.3c6wxkAER2svWMW9zv4orijhpBs81l5KKb7MtZ5Gn80`,
};
async function carregarCarrinhoEProdutos() {
  try {
    const resProdutos = await apiController.get(apiProduto, {
      headers,
    });
    products.value = resProdutos.data;
    console.log("wwww->", products.value);

    const resCarrinho = await apiController.get(apiCarrinho, {
      params: { usuarioId },
      headers,
    });
    //console.log('yyy->',resCarrinho)
    carrinho.value = resCarrinho.data;
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
}

async function adicionarCarrinho(productId: number) {
  const existente = carrinho.value.find(
    (i: { produtoId: number }) => i.produtoId === productId
  );

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

const cartTotal = computed(() =>
  carrinho.value.reduce(
    (sum: number, item: { produtoId: any; qtd: number }) => {
      const product = products.value.find(
        (p: { id: any }) => p.id === item.produtoId
      );
      return sum + (product ? product.price * item.qtd : 0);
    },
    0
  )
);

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const nomeMatch = p.nome.toLowerCase().includes(search.value.toLowerCase());

    // Aplica filtro de preço
    const precoMinOk = minPrice.value === null || p.valor >= minPrice.value;
    const precoMaxOk = maxPrice.value === null || p.valor <= maxPrice.value;

    return nomeMatch && precoMinOk && precoMaxOk;
  });
});

const sortedProducts = computed(() => {
  console.log("Produtos filtrados:", filteredProducts.value);
  const list = [...filteredProducts.value];
  switch (sortBy.value) {
  case "Menor preço":
    return list.sort((a, b) => a.valor - b.valor);
  case "Maior preço":
    return list.sort((a, b) => b.valor - a.valor);
  case "Nome (A-Z)":
    return list.sort((a, b) => a.nome.localeCompare(b.nome));
  case "Nome (Z-A)":
    return list.sort((a, b) => b.nome.localeCompare(a.nome));
  default:
    return list;
}
});

const goToDetails = (produto: Product) => {
  router.push({
    name: 'DetalhesProdutos',
    params: { id: produto.id.toString() },
  });
};


onMounted(() => carregarCarrinhoEProdutos());

</script>

<style scoped>
.home {
  background-color: #f5f5f5;
  min-height: 100vh;
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
