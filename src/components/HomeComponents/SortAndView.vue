<template>
  <div class="sort-view d-flex align-center gap-2">
    <v-select v-model="sort" :items="items" dense hide-details style="max-width:200px" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({ sort: String });
const emit = defineEmits(['update:sort']);
const items = [
  { title:'Mais recentes', value:'recent' },
  { title:'Menor preço', value:'price-asc' },
  { title:'Maior preço', value:'price-desc' },
];
const sort = ref((props as any).sort || 'recent');
watch(sort, v => emit('update:sort', v));
</script>

<style scoped>

</style>