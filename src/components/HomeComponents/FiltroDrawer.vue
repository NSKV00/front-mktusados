<template>
  <v-navigation-drawer v-model="openLocal" right width="380" class="filter-drawer" overlay>
    <div class="drawer-head pa-3 d-flex align-center justify-space-between">
      <div><h3>Filtros</h3><small class="muted">Refine sua busca</small></div>
      <v-btn icon @click="openLocal = false"><v-icon>mdi-close</v-icon></v-btn>
    </div>

    <v-divider />

    <v-form class="pa-4" ref="formRef">
      <v-text-field v-model="local.nomeProduto" label="Nome do produto" dense clearable prepend-inner-icon="mdi-text-box" />
      <v-select v-model="local.categoriaNome" :items="categorias" label="Categoria" dense clearable prepend-inner-icon="mdi-tag" />
      <v-select v-model="local.vendedorNome" :items="vendedores" label="Vendedor" dense clearable prepend-inner-icon="mdi-store" />

      <v-row>
        <v-col cols="6">
          <v-text-field v-model.number="local.valorMinimo" label="Valor mínimo" type="number" dense prepend-inner-icon="mdi-currency-brl" clearable />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model.number="local.valorMaximo" label="Valor máximo" type="number" dense prepend-inner-icon="mdi-currency-brl" clearable />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-btn block color="deep-purple accent-3" dark @click="apply">Aplicar</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block outlined @click="clear">Limpar</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-spacer />
    <v-divider />
    <v-card-text class="pa-4 muted small">Dica: use a busca rápida no topo para resultados instantâneos.</v-card-text>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
  open: { type:Boolean, default:false },
  categorias: { type:Array, default: ()=>[] },
  vendedores: { type:Array, default: ()=>[] },
  initialFilters: { type:Object, default: ()=>({}) }
});
const emit = defineEmits(['update:open','apply','clear']);
const openLocal = ref(props.open);
watch(() => props.open, v => openLocal.value = v);
watch(openLocal, v => emit('update:open', v));

const local = ref({ nomeProduto:'', categoriaNome:'', vendedorNome:'', valorMinimo:null, valorMaximo:null });
watch(() => props.initialFilters, v => { local.value = { ...local.value, ...v }; }, { immediate:true });

function apply(){ emit('apply', { ...local.value }); openLocal.value = false; }
function clear(){ local.value = { nomeProduto:'', categoriaNome:'', vendedorNome:'', valorMinimo:null, valorMaximo:null }; emit('clear'); }
</script>

<style scoped>
.filter-drawer { background:white; border-top-left-radius:12px; border-bottom-left-radius:12px; }
.drawer-head h3 { margin:0; color:#372b73; }
.muted { color:#777; }
</style>
