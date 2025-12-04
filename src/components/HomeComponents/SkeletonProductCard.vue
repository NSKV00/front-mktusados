<template>
  <v-sheet class="skeleton-card pa-3">
    <v-skeleton-loader type="image, text, text" />
  </v-sheet>
</template>

<style scoped>
    .skeleton-card { 
        background:white; 
        border-radius:12px; 
        box-shadow:0 6px 18px rgba(0,0,0,0.04); 
    }
</style>