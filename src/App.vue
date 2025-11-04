<template>
  <v-app class="app">
    <app-header v-if="isHomePage" />
    <v-main class="main-content">
      <router-view />
    </v-main>
    <app-footer v-if="isHomePage" />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './components/footer.vue'
import AppHeader from './components/header.vue'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<style>
.app {
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
}

.main-content {
  padding: 0 !important;
}
</style>