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
      :width="menuWidth"
      location="bottom"
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
            class="mb-4"
            @update:modelValue="emitUpdate"
          />

          <div class="price-label">Faixa de preço: R$ {{ priceRange[0] }} - R$ {{ priceRange[1] }}</div>
          <v-range-slider
            v-model="priceRange"
            :min="0"
            :max="5000"
            step="50"
            color="deep-purple-accent-4"
            hide-details
            class="mt-2 mb-4"
            @end="emitUpdate"
          />

          <v-btn
            block
            color="deep-purple-accent-4"
            variant="flat"
            class="text-white"
            @click="applyAndClose"
          >
            Aplicar
          </v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

const categories = [
  'Todos',
  'Eletrônicos',
  'Roupas',
  'Livros',
  'Acessórios'
]

const menuWidth = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 480) return 280
  return 300
})

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
  position: relative;
}

.search-input {
  border-radius: 25px !important;
  background-color: #f5f5f5 !important;
  max-width: 420px;
  width: 100%;
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
  padding: 1.5rem;
}

.price-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

:deep(.v-select__control) {
  border-radius: 8px;
}

:deep(.v-range-slider__thumb) {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .search-input {
    max-width: 100%;
  }

  .filter-card {
    padding: 1.25rem;
  }
}

@media (max-width: 768px) {
  .search-input {
    max-width: 100%;
  }

  .filter-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .search-input {
    max-width: calc(100% - 16px);
    margin: 0 8px;
  }

  .filter-card {
    padding: 1rem;
  }
}
</style>
