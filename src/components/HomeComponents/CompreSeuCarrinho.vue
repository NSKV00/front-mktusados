<template>
  <v-sheet class="pa-4 mt-6" elevation="1">
    <div class="d-flex justify-space-between align-center mb-3">
      <div>
        <h3 class="mb-0">Compre seu carrinho</h3>
        <small class="muted">Finalize agora — ofertas selecionadas</small>
      </div>
      <v-btn text small @click="$emit('goto-suggestions')">Ver mais sugestões</v-btn>
    </div>

    <v-row>
      <v-col v-for="(p,i) in cartProducts" :key="i" cols="6" md="3">
        <v-card v-if="p" class="small-card" @click="$emit('goto-product', p)">
          <v-img :src="p.img" height="130" />
          <v-card-text>
            <div class="d-flex justify-space-between">
              <div class="truncate title">{{ p.nome }}</div>
              <div class="price">R$ {{ formatPrice(p.valor) }}</div>
            </div>
          </v-card-text>
        </v-card>

        <v-card v-else class="suggest-card">
          <v-card-text class="text-center">
            <v-icon size="36">mdi-lightbulb-on-outline</v-icon>
            <div class="mt-2">Sugestão</div>
            <v-btn text small @click="$emit('goto-suggestions')">Ver sugestões</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
const props = defineProps({ 
  cartProducts: { 
    type: Array as () => Array<{ img: string; nome: string; valor: number }>, 
    default: () => [] 
  } 
});
function formatPrice(v:any){ return Number(v||0).toFixed(2).replace('.',','); }
</script>

<style scoped>
.small-card { min-height:200px; cursor:pointer; border-radius:10px; }
.suggest-card { min-height:200px; display:flex; align-items:center; justify-content:center; border:1px dashed #eee; border-radius:10px; }
.title { font-weight:700; color:#372b73; }
.price { color:#FF6B6B; font-weight:800; }
.muted { color:#666; }
</style>