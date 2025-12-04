<template>
  <v-app-bar color="white" height="80" class="header-appbar elevation-2">
    <v-container fluid class="d-flex align-center gap-4">

      <v-text-field
        v-model="localSearch"
        @input="onInput"
        @keyup.enter="emitSearch"
        placeholder="Buscar por produtos, lojas ou marcas..."
        prepend-inner-icon="mdi-magnify"
        dense
        rounded
        class="search-field"
        clearable
      />

      <v-spacer />

      <v-btn icon @click="$emit('open-filters')" title="Filtros">
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>

      <v-btn icon @click="$emit('update:drawerCart', true)">
        <v-icon>mdi-cart-outline</v-icon>
        <v-badge v-if="cartCount>0" :content="cartCount" color="deep-purple accent-3" />
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import carrinho from '../carrinho.vue';

const props = defineProps({ modelValue: Boolean, 'cart-count': Number });
const emit = defineEmits(['update:drawerCart','open-filters','update:searchTerm']);
const localSearch = ref('');
const cartCount = ref(0);

if ((props as any)['cart-count']) cartCount.value = (props as any)['cart-count'];

let debounce:any = null;
function onInput(){
  clearTimeout(debounce);
  debounce = setTimeout(()=> {
    emit('update:searchTerm', localSearch.value);
    // also broadcast emitter for backward compatibility
    // @ts-ignore
    window?.$$emitter?.emit?.('applyFilters', { search: localSearch.value });
  }, 350);
}
function emitSearch(){ emit('update:searchTerm', localSearch.value); }
watch(() => (props as any)['cart-count'], v => cartCount.value = v);
</script>

<style scoped>
  .header-appbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    position: sticky; 
    top:0; 
    z-index:60; 
    background:white; 
  }
  .brand-text { 
    color:#372b73; 
    font-weight:700; 
    font-size:1.1rem; 
  }
  .search-field { 
    align-items: center;
    max-width:760px;
    width:100%; 
  }
</style>