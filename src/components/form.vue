<template>
  <v-text-field
    v-bind="$attrs"
    :rules="rules"
    variant="outlined"
    class="custom-input"
    :class="{'has-error': error}"
    :error-messages="error"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]>
      <slot :name="slot" />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
defineProps<{
  rules?: ((v: any) => boolean | string)[]
  error?: string
}>()
</script>

<style scoped>
.custom-input {
  margin-top: 0.25rem;
}

:deep(.v-field) {
  background: var(--color-input-bg);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-md);
}

:deep(.v-field__input) {
  color: var(--color-text);
  min-height: var(--input-height);
  padding: var(--spacing-sm) var(--spacing-md);
}

.form {
  gap: clamp(0.75rem, 2vw, 1rem);
  padding: clamp(1rem, 3vw, 1.5rem);
}
</style>

