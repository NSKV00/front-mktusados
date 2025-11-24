<template>
  <v-navigation-drawer
    :model-value="aberto"
    @update:model-value="emit('update:aberto', $event)"
    location="right"
    temporary
    width="400"
    class="carrinho-drawer"
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

    <v-list v-if="carrinho.length > 0" class="pa-0">
      <v-list-item
        v-for="item in itensComDetalhes"
        :key="item.id"
        class="carrinho-item pa-3"
      >
        <v-row align="center" no-gutters>
          <v-col cols="3">
            <v-img :src="item.img" height="60" width="60" contain class="rounded-sm item-image-border" />
          </v-col>
          
          <v-col cols="6" class="pl-2">
            <v-list-item-title class="item-nome text-subtitle-2 font-weight-medium mb-1">
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


    <template v-slot:append>
      <div class="pa-4 bg-grey-lighten-4">
        <v-row class="total-summary">
          <v-col class="text-h6 font-weight-bold">Total:</v-col>
          <v-col class="text-h6 font-weight-bold text-right text-success">
            R$ {{ totalCarrinho.toFixed(2).replace('.', ',') }}
          </v-col>
        </v-row>
        <v-btn
          color="deep-purple-accent-4"
          size="large"
          block
          :disabled="carrinho.length === 0"
          @click="finalizarCompra"
        >
          Finalizar Compra
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue';
import { toast } from 'vue3-toastify';


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
  (e: 'update:aberto', value: boolean): void; 
  (e: 'remover', index: number): void; 
  (e: 'finalizar'): void; 
}>();


const itensComDetalhes = computed(() => {
  if (!props.carrinho) return [];

  return props.carrinho.map(item => {
    const produtoDetalhe = props.produtos.find(p => p.id === item.produtoId);
    
    
    const valorUnitario = produtoDetalhe?.valor || 0; 
    
    return {
      ...item,
      nome: produtoDetalhe?.nome || 'Produto Removido',
      valorUnitario: valorUnitario,
      img: produtoDetalhe?.img || '',
      subtotal: valorUnitario * item.qtd
    };
  });
});

const totalCarrinho = computed(() => {
  return itensComDetalhes.value.reduce((total, item) => total + item.subtotal, 0);
});



function fecharDrawer() {
  emit('update:aberto', false);
}

function removerItem(itemId: number) {

  const index = props.carrinho.findIndex(item => item.id === itemId);
  if (index !== -1) {
    emit('remover', index);
    toast.info("Item removido do carrinho.");
  }
}

function finalizarCompra() {
    
    fecharDrawer();
    emit('finalizar');
    
}

</script>

<style scoped>
.carrinho-drawer {
  z-index: 1000 !important;
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
  border: 1px solid #ddd;
  border-radius: 4px;
}
.carrinho-item {
  border-bottom: 1px solid #eee;
}
.item-nome {
  white-space: normal;
  line-height: 1.3;
}
.item-info {
  color: #666;
  font-weight: 500;
}
.item-subtotal {
  display: block;
  color: #43119b;
  font-weight: 700;
}
.total-summary {
  padding: 8px 0;
  border-top: 2px solid #ccc;
}

</style>