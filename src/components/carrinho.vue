<template>
  <v-navigation-drawer
  v-model="drawerInterno"
  location="right"
  temporary
  width="400"
  class="carrinho-drawer"
  color="white"
  style="z-index: 9999 !important; position: fixed !important;"
>

    
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
            <v-list-item-title
              class="item-nome text-subtitle-2  mb-1"
            >
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

  
    <div class="pa-4 bg-grey-lighten-4 mt-auto">
      <v-row class="total-summary">
        <v-col class="text-h6 font-weight-bold">Total:</v-col>
        <v-col class="text-h6 font-weight-bold text-right ">
          R$ {{ totalCarrinho.toFixed(2).replace('.', ',') }}
        </v-col>
      </v-row>
      <v-btn
        class="mt-3"
        color="primary"
        block
        :disabled="itensComDetalhes.length === 0"
        @click="$emit('finalizar')"
      >Finalizar Compra</v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps, defineEmits } from "vue";
import { toast } from "vue3-toastify";


interface Product {
  id: number;
  nome: string;
  valor: number;
  img: string;
}

interface CarrinhoItem {
  id: number;
  produtoId: number;
  qtd: number;
}

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

function finalizarCompra() {
  emit("finalizar");
  
}

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
  z-index: 1000 !important;
  display: flex;
  flex-direction: column;
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
  border: 1px solid #0c0c0c;
  border-radius: 4px;
}
.carrinho-item {
  border-bottom: 1px solid #ffffff;
}
.item-nome {
  white-space: normal;
  line-height: 1.3;
  color:#ff8801;
  font-weight: 700;
  text-align: justify;
}
.item-info {
  display: block;
  color: #ff8801;
  font-weight: 700;
  text-align: justify;
}
.item-subtotal {
  display: block;
  color: #ff8801;
  font-weight: 700;
  text-align: justify;
}
.total-summary {
  padding: 8px 0;
  border-top: 2px solid #d3d3d3;
  background-color: #ffffff;
}

</style>
