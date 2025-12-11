<template>
<v-navigation-drawer
  v-model="drawerInterno"
  location="right"
  temporary
  width="400"
  class="carrinho-drawer"
  color="white"
>
  <div class="drawer-content">
    <v-list-item class="drawer-header">
      <v-icon start>mdi-cart-outline</v-icon>
      <v-list-item-title class="text-h6 font-weight-bold">
        Seu Carrinho ({{ carrinho.length }})
      </v-list-item-title>
      <template v-slot:append>
        <v-btn icon="mdi-close" variant="text" @click="fecharDrawer"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <div class="carrinho-itens-scroll">
      <v-list v-if="itensComDetalhes.length > 0">
        <v-list-item
          v-for="item in itensComDetalhes"
          :key="item.id"
          class="carrinho-item pa-3"
        >
          <v-row align="center" no-gutters>
            <v-col cols="3">
              <v-img
                :src="item.img"
                height="60"
                width="60"
                contain
                class="rounded-sm item-image-border"
              />
            </v-col>
            <v-col cols="6" class="pl-2">
              <v-list-item-title class="item-nome text-subtitle-2 mb-1">
                {{ item.nome }}
              </v-list-item-title>
              <v-list-item-subtitle class="item-info text-caption">
                Qtd: {{ item.qtd }} | R$ {{ item.valorUnitario.toFixed(2).replace('.', ',') }}
              </v-list-item-subtitle>
              <strong class="item-subtotal text-body-2 mt-1">
                R$ {{ item.subtotal.toFixed(2).replace('.', ',') }}
              </strong>
            </v-col>
            <v-col cols="3" class="text-right">
              <v-btn
                icon="mdi-delete"
                variant="flat"
                size="small"
                style="background-color: #ffffff00;"
                color="grey-lighten-4"
                @click="removerItem(item.id)"
              />
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
        </v-list-item>
      </v-list>

      <div v-else class="text-center pa-4 text-medium-emphasis">
        <v-icon size="48" color="grey">mdi-cart-off</v-icon>
        <p class="mt-2">Seu carrinho está vazio.</p>
      </div>
    </div>

    <!-- TOTAL + BOTÃO FIXO -->
    <div class="total-btnBuy">
      <div class="pa-4 bg-grey-lighten-4">
        <v-row class="total-summary">
          <v-col class="text-h6 font-weight-bold">Total:</v-col>
          <v-col class="text-h6 font-weight-bold text-right">
            R$ {{ totalCarrinho.toFixed(2).replace('.', ',') }}
          </v-col>
        </v-row>

        <button class="btn-buy"
          @click="handleBuyNow"
          :disabled="itensComDetalhes.length === 0"
          aria-label="Comprar agora">
          💳 Comprar Agora
        </button>
      </div>
    </div>
  </div>
</v-navigation-drawer>

</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { toast } from "vue3-toastify";
import { useRouter} from 'vue-router'
import api from "../controller/api"
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  nome?: string;
  email?: string;
}

const tokenLocal = localStorage.getItem("token") || ""
const user = ref<User | null>(tokenLocal ? jwtDecode<User>(tokenLocal) : null);
const usuarioIdLogado = Number(user.value!.id);


interface Product {
  id: number;
  nome: string;
  valor: number;
  img?: string;
}

interface CarrinhoItem {
  id: number;
  produtoId: number;
  qtd: number;
}

const router = useRouter()
 



const props = defineProps<{
  aberto: boolean;
  carrinho: CarrinhoItem[];
  produtos: Product[];
}>();

const emit = defineEmits<{
  (e: "update:aberto", value: boolean): void;
  (e: "remover", index: number): void;
  (e: "carregar-carrinho"): void;
  (e: "finalizar"): void;
}>();

const drawerInterno = ref(false);


watch(() => props.aberto, (val) => {
  drawerInterno.value = val;
});

watch(drawerInterno, (isOpen) => {
  emit("update:aberto", isOpen);

  document.body.style.overflow = isOpen ? "hidden" : "auto";

  if (isOpen) {
    emit("carregar-carrinho");
  }
});

const itensComDetalhes = computed(() => {
  return props.carrinho.map((item) => {
    const produto = props.produtos.find((p) => p.id === (item.produtoId ?? item.produtoId));

    
    if (!produto) {
      return {
        ...item,
        nome: "Produto Indisponível",
        valorUnitario: 0,
        img: "/placeholder.png",
        subtotal: 0,
        disponivel: false
      };
    }
    
    return {
    ...item,
    nome: produto.nome,
    valorUnitario: produto.valor,
    img: `data:image/jpeg;base64,${produto.img}`,
    subtotal: produto.valor * item.qtd,
    disponivel: true
};
  });
});


const totalCarrinho = computed(() => {
  return itensComDetalhes.value.reduce((total, item) => total + item.subtotal, 0);
});

function fecharDrawer() {
  drawerInterno.value = false;
}

function removerItem(itemId: number) {
  const index = props.carrinho.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    emit("remover", index);
    toast.info("Item removido do carrinho.");
  }
}

const handleBuyNow = async () => {
  if (itensComDetalhes.value.length === 0) {
    toast.error("Seu carrinho está vazio!");
    return;
  }

  const indisponiveis = itensComDetalhes.value.filter(item => !item.disponivel || item.subtotal <= 0);
  if (indisponiveis.length > 0) {
    toast.error("Alguns produtos do carrinho não estão disponíveis.");
    return;
  }

  try {
    const dto = {
      UsuarioId: usuarioIdLogado, 
      Itens: itensComDetalhes.value.map(item => ({
        ProdutoId: item.produtoId,
        Quantidade: item.qtd
      }))
    };

    const response = await api.post("/checkout", dto);

    toast.success("Checkout criado com sucesso!");

    const checkoutId = Number(response.data.id);
    router.push(`/pagamento?checkoutId=${checkoutId}`);
  } catch (error: any) {
    toast.error("Erro ao criar checkout: " + (error.response?.data?.message || error.message));
  }
};





</script>

<style scoped>
.text-h6{
  font-weight: 700px;
}
 .font-weight-bold{
  font-weight: 700px;
  color: #43119b;
}

.carrinho-drawer {
  height: 100vh !important;
  position: fixed !important;
  z-index: 9999 !important;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-header {
  background-color: #43119b; 
  color: white;
}

.carrinho-itens-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}


.total-btnBuy {
  border-top: 1px solid #ddd;
  background-color: white; 
  padding: 8px 16px;
  padding-bottom: 112px;
}


.btn-buy {
  width: 80%;
  margin-top: 8px;
  padding: 12px;
  background-color: #43119b;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  padding-bottom: 12px;
}

.drawer-header {
  padding: 16px;
  background-color: #43119b;
  color: white;
}
.drawer-header .v-list-item-title {
  color: white;
}
.item-image-border {
  border-radius: 4px;
}
.carrinho-item {
  border-bottom: 1px solid #ffffff;
}
.item-nome {
  white-space: normal;
  line-height: 1.3;
  color:#0e0e0e;
  font-weight: 700;
  text-align: justify;
}
.item-info {
  display: block;
  color: #0e0e0e;
  font-weight: 700;
  text-align: justify;
}
.item-subtotal {
  display: block;
  color: #0e0e0e;
  font-weight: 700;
  text-align: justify;
}
.total-summary {
  padding: 8px 0;
  border-top: 2px solid #d3d3d3;
  background-color: #ffffff;
}

</style>