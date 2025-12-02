<template>
  <v-card class="product-card" elevation="1" @click="$emit('click')">

    <!-- Badge "Novo" -->
    <v-badge
      v-if="isNew"
      color="deep-purple accent-3"
      class="badge-new"
      offset-x="10"
      offset-y="10"
    >
      <template #badge>Novo</template>
    </v-badge>

    <!-- Imagem -->
    <v-img
      :src="converterBase64(product.img)"
      class="product-image"
      height="200"
      cover
    />

    <!-- Conteúdo -->
    <v-card-text class="card-content">

      <div class="product-title">{{ product.nome }}</div>

      <div class="product-price">
        R$ {{ formatPrice(product.valor) }}
      </div>

      <div class="product-info">
        {{ product.categoriaNome }} • {{ product.vendedorNome || 'Vendedor' }}
      </div>

    </v-card-text>

    <!-- Ações -->
    <v-card-actions class="card-actions">
      <v-btn
        block
        color="deep-purple accent-3"
        class="buy-button"
        @click.stop="$emit('buy-now', product)"
      >
        Comprar
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  product: { type: Object, required: true }
});

function formatPrice(v:any){
  return Number(v||0).toFixed(2).replace('.',',');
}

const converterBase64 = (base64:any) => {
    if (!base64 || typeof base64 !== 'string') return null
    const trimmed = base64.trim()
    if (trimmed.startsWith('data:')) return trimmed

    let tipo = 'image/png'
    if (trimmed.startsWith('/9j/')) tipo = 'image/jpeg'

    return `data:${tipo};base64,${trimmed}`
}

const isNew = computed(() => {
  if (!props.product.createdAt) return false;
  try {
    const created = new Date(props.product.createdAt);
    const diff = Date.now() - created.getTime();
    return diff < (1000 * 60 * 60 * 24 * 7);
  } catch {
    return false;
  }
});
</script>

<style scoped>
/* -------- CARD BASE -------- */
.product-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  color: #050505;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.5rem;
  transition: transform .18s ease, box-shadow .18s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(55, 43, 115, 0.15);
}

/* -------- IMAGE -------- */
.product-image {
  width: 100%;
  height: 220px !important;
  border-radius: 10px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

/* -------- CONTENT -------- */
.card-content {
  padding: 1rem;
}

.product-title {
  font-weight: 700;
  color: #372b73;
  font-size: 1rem;
  margin-bottom: 0.4rem;
  min-height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.25rem;
  color: #fcca00;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.product-info {
  font-size: 0.85rem;
  color: #777;
}

/* -------- BUTTON -------- */
.card-actions {
  padding: 0.8rem 1rem 1.2rem;
}

.buy-button {
  font-size: 0.95rem;
  text-transform: none;
  font-weight: 600;
  border-radius: 10px;
}

/* -------- BADGE -------- */
.badge-new {
  position: absolute;
  top: 10px;
  left: 10px;
}

/* -------- RESPONSIVIDADE -------- */

/* Telas muito grandes */
@media (min-width: 1600px) {
  .product-image {
    height: 260px !important;
  }
  .product-card {
    border-radius: 16px;
  }
  .product-title {
    font-size: 1.05rem;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .product-card {
    border-radius: 12px;
  }
  .product-image {
    height: 180px !important;
  }
  .product-price {
    font-size: 1.15rem;
  }
  .product-title {
    font-size: 0.9rem;
  }
}

/* Tablets */
@media (max-width: 960px) {
  .product-image {
    height: 200px !important;
  }
}
</style>
