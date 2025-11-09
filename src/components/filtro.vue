<template>
  <div class="search-container">
    <!-- Campo de pesquisa -->
    <v-text-field
      v-model="search"
      placeholder="Buscar produtos, marcas e muito mais..."
      variant="solo"
      density="comfortable"
      prepend-inner-icon="mdi-magnify"
      hide-details
      clearable
      class="search-bar"
      @keyup.enter="emitSearch"
    />

    <!-- Botão de filtro -->
    <v-btn color="primary" class="filter-btn" @click="toggleFilterDrawer">
      <v-icon start>mdi-filter-variant</v-icon>
      Filtro
    </v-btn>

    <!-- Botão de carrinho -->
    <v-btn color="primary" class="carrinho-btn" @click="$emit('open-carrinho')">
      <v-badge
        :content="carrinhoCount"
        color="red"
        overlap
        v-if="carrinhoCount > 0"
      >
        <v-icon>mdi-cart</v-icon>
      </v-badge>
      <template v-else>
        <v-icon>mdi-cart-outline</v-icon>
      </template>
    </v-btn>

    <!-- Drawer de Filtros -->
    <v-navigation-drawer
      v-model="filterDrawer"
      location="right"
      temporary
      class="filter-drawer"
    >
      <v-list>
        <v-list-item-title class="filter-title">Filtros</v-list-item-title>
        <v-divider class="my-2" />

        <!-- Ordenação -->
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Ordenar por"
          variant="outlined"
          density="comfortable"
        />

        <!-- Categoria (exemplo adicional) -->
        <v-select
          v-model="categoria"
          :items="categorias"
          label="Categoria"
          variant="outlined"
          density="comfortable"
          class="mt-3"
        />

        <!-- Faixa de preço -->
        <v-range-slider
          v-model="precoRange"
          :max="1000"
          :step="10"
          label="Faixa de preço"
          class="mt-4"
          thumb-label
        />

        <!-- Botões -->
        <div class="mt-4 d-flex flex-column gap-2">
          <v-btn block color="primary" @click="applyFilters">Aplicar</v-btn>
          <v-btn block variant="outlined" color="grey" @click="resetFilters">
            Limpar
          </v-btn>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface FilterEvent {
  search: string;
  sortBy: string;
  categoria: string | null;
  precoRange: [number, number];
}

const props = defineProps<{
  carrinhoCount: number;
}>();

const emit = defineEmits<{
  (e: "update", filters: FilterEvent): void;
  (e: "open-carrinho"): void;
}>();

// Estados locais
const search = ref("");
const sortBy = ref("Padrão");
const categoria = ref<string | null>(null);
const precoRange = ref<[number, number]>([0, 1000]);
const filterDrawer = ref(false);

// Opções
const sortOptions = ["Padrão", "Menor preço", "Maior preço", "Nome (A-Z)"];
const categorias = ["Eletrônicos", "Roupas", "Acessórios", "Beleza", "Outros"];

// Métodos
const toggleFilterDrawer = () => (filterDrawer.value = !filterDrawer.value);

const applyFilters = () => {
  emit("update", {
    search: search.value,
    sortBy: sortBy.value,
    categoria: categoria.value,
    precoRange: precoRange.value,
  });
  filterDrawer.value = false;
};

const resetFilters = () => {
  search.value = "";
  sortBy.value = "Padrão";
  categoria.value = null;
  precoRange.value = [0, 1000];
  applyFilters();
};

const emitSearch = () => applyFilters();

// Atualiza dinamicamente ao digitar
watch(search, () => {
  emit("update", {
    search: search.value,
    sortBy: sortBy.value,
    categoria: categoria.value,
    precoRange: precoRange.value,
  });
});
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  padding: 0.5rem 1rem;
}

.search-bar {
  min-width: 40%;
}

.filter-btn,
.carrinho-btn {
  height: 40px;
}

.filter-drawer {
  width: 320px;
  padding: 1rem;
}

.filter-title {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
</style>
