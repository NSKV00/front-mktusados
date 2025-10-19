<template>
  <v-btn
    v-bind="$attrs"
    :loading="loading"
    :height="height"
    :class="[variant]"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  variant?: 'primary' | 'outline' | 'text'
  height?: number
}>()
</script>

<style scoped>
.primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)) !important;
  color: white !important;
  height: var(--input-height);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  transition: var(--transition-quick);
}

.outline {
  border: 1px solid currentColor !important;
}

.v-btn {
  text-transform: none;
}
</style>