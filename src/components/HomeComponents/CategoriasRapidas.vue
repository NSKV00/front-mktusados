<template>
  <v-sheet class="pa-2 categories-sheet" elevation="0">
    <div class="chips-row">
      <v-chip
        v-for="cat in categories"
        :key="cat"
        :class="{'active-chip': selected===cat}"
        outlined
        @click="$emit('update:selected', cat); $emit('select', cat)"
      >
        <v-icon left small>{{ iconFor(cat) }}</v-icon>
        {{ cat }}
      </v-chip>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
const props = defineProps({
  categories: { type: Array as () => string[], default: () => [] },
  selected: { type: String, default: null }
});
const emit = defineEmits(['update:selected','select']);
function iconFor(cat:string){
  const map:any = { 'Eletrônicos':'mdi-cellphone','Moda':'mdi-tshirt-crew','Beleza':'mdi-lipstick','Casa':'mdi-sofa','Jogos':'mdi-gamepad','Tudo':'mdi-fire' };
  return map[cat] || 'mdi-tag';
}
</script>

<style scoped>
.categories-sheet { background:transparent; }
.chips-row { display:flex; gap:10px; overflow-x:auto; padding-bottom:6px; }
.active-chip { background: linear-gradient(90deg,#372b73,#FF6B6B); color:white !important; }
</style>