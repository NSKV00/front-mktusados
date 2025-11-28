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
  :aberto="carrinhoDrawer"
  :carrinho="carrinho"
  :produtos="products"
  @update:aberto="carrinhoDrawer = $event"
  @remover="removerItem"
  @carregar-carrinho="carregarCarrinhoEProdutos"
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
            <v-card class="product-card">
  <v-img :src="product.img" height="180px" @click="goToDetails(product)" />

  <v-card-text @click="goToDetails(product)">
    <h3>Nome: {{ product.nome }}</h3>
    <p class="price">R$ {{ product.valor }}</p>
    <p class="categoria">categoria: {{ product.categoria }}</p>
    <p class="quantidade">Quantidade: {{ product.quantidade }}</p>
  </v-card-text>

  <v-card-actions>
    <v-btn 
      color="deep-purple-accent-4"
      block
      @click.stop="adicionarAoCarrinho(product)"
    >
      Adicionar ao Carrinho ({{ quantidade || 1 }})
    </v-btn>
  </v-card-actions>
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
import { toast } from 'vue3-toastify'
import Carrinho from "../components/carrinho.vue"; 



interface Product {
  id: number;
  nome: string;
  description: string;
  quantidade: number;
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
const carrinhoDrawer = ref(false);
const products = ref<Product[]>([]);
const carrinho = ref<CarrinhoItem[]>([]);
const quantidade = ref(1);
const usuarioId = (() => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return Number(payload.id);
})();


const headers = {
  Authorization:
    `Bearer ${localStorage.getItem('token')}`,
};

async function adicionarAoCarrinho(produto: Product) {
  if (!produto) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Você precisa estar logado para adicionar itens ao carrinho.");
      return;
    }

    
    const payload = JSON.parse(atob(token.split(".")[1]));
    const usuarioId = Number(payload.id);

    if (!usuarioId) {
      toast.error("Usuário inválido. Faça login novamente.");
      return;
    }

    await apiController.post("/itemCarrinho",
      {
        UsuarioId: usuarioId,
        ProdutoId: produto.id,
        Qtd: 1,
      },
      { 
        headers: { Authorization: `Bearer ${token}` } 
      }
    );
    await carregarCarrinhoEProdutos();
    toast.success("Item adicionado ao carrinho com sucesso!");

  } catch (err: any) {
    console.error("Erro ao adicionar ao carrinho:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Erro ao adicionar ao carrinho");
  }
}

async function carregarCarrinhoEProdutos() {
  try {
    const resProdutos = await apiController.get("/produto", { headers });
    products.value = resProdutos.data;

    const resCarrinho = await apiController.get("/itemcarrinho", {
      params: { usuarioId },
      headers,
    });
    carrinho.value = resCarrinho.data;

  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
}
async function removerItem(index: number) {
  const item = carrinho.value[index];
  if (!item) return;
  try {
    await apiController.delete(`/itemcarrinho/${item.id}`, { headers });
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
  position:absolute;
  top: 15px;   
  right: 20px;
  z-index: 999;
}
.carrinho-drawer {
  position: fixed ;
  right: 0 ;
  top: 0;
  height: 100vh;
  z-index: 9999 ;
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
  height: 400px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(204, 0, 255, 0.441);
}
.price {
  font-size: 1.2rem;
  color: #000000;
  font-weight: 600;
  margin-top: 0.5rem;
}
</style>
