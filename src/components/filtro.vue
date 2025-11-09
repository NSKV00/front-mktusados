<template>
  <div class="search-filter">
    <v-text-field
      v-model="search"
      variant="solo-filled"
      flat
      hide-details
      density="comfortable"
      placeholder="Buscar produtos..."
      prepend-inner-icon="mdi-magnify"
      append-inner-icon="mdi-filter-variant"
      @click:append-inner="toggleFilter"
      @input="emitUpdate"
      class="search-input"
    />

    <v-menu
      v-model="filterMenu"
      activator="parent"
      transition="scale-transition"
      width="260"
      offset-y
    >
      <v-card class="filter-card" elevation="6">
        <v-card-text>
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Categoria"
            variant="outlined"
            density="compact"
            hide-details
            class="mt-1"
            @update:modelValue="emitUpdate"
          />

          <v-range-slider
            v-model="priceRange"
            :min="0"
            :max="5000"
            step="50"
            label="Faixa de preço (R$)"
            thumb-label="always"
            color="deep-purple-accent-4"
            hide-details
            class="mt-4"
            @end="emitUpdate"
          />

          <v-btn
            block
            color="deep-purple-accent-4"
            variant="flat"
            class="mt-4 text-white"
            @click="applyAndClose"
          >
            Aplicar filtro
          </v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'update', filters: {
    search: string
    category: string
    priceRange: [number, number]
  }): void
}>()

const search = ref('')
const selectedCategory = ref('')
const priceRange = ref<[number, number]>([0, 5000])
const filterMenu = ref(false)

const categories = ref([
  'Todos',
  'Eletrônicos',
  'Roupas',
  'Livros',
  'Acessórios'
])

const toggleFilter = () => {
  filterMenu.value = !filterMenu.value
}

const emitUpdate = () => {
  emit('update', {
    search: search.value,
    category: selectedCategory.value === 'Todos' ? '' : selectedCategory.value,
    priceRange: priceRange.value
  })
}

const applyAndClose = () => {
  emitUpdate()
  filterMenu.value = false
}
</script>

<style scoped>
.search-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  position: relative;
}

.search-input {
  border-radius: 25px !important;
  background-color: #f5f5f5;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.search-input:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.search-input:focus-within {
  box-shadow: 0 0 0 2px #7e57c2;
  transform: scale(1.01);
}

.filter-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
</style>
