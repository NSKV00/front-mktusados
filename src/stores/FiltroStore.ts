import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilterStore = defineStore("filterStore", () => {
  const search = ref("");
  const selectedCategory = ref<string | null>(null);
  const priceRange = ref<[number, number]>([0, 10000]);
  const sortBy = ref("Padrão");

  function setFilters(newFilters: {
    search?: string;
    category?: string | null;
    priceRange?: [number, number];
    sortBy?: string;
  }) {
    if (newFilters.search !== undefined) search.value = newFilters.search;
    if (newFilters.category !== undefined) selectedCategory.value = newFilters.category;
    if (newFilters.priceRange !== undefined) priceRange.value = newFilters.priceRange;
    if (newFilters.sortBy !== undefined) sortBy.value = newFilters.sortBy;
  }

  const setSearch = (val: string) => (search.value = val);
  const setCategory = (val: string | null) => (selectedCategory.value = val);
  const setPriceRange = (val: [number, number]) => (priceRange.value = val);
  const setSortBy = (val: string) => (sortBy.value = val);

  return {
    search,
    selectedCategory,
    priceRange,
    sortBy,

    setFilters,
    setSearch,
    setCategory,
    setPriceRange,
    setSortBy,
  };
});
