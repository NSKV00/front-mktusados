<template>
  <v-app class="app">
    <app-header v-if="isHomePage || isEnderecoPage || isPerfilPage || isProdutoPage || isProdutoPage2 || dashboard" />
    <v-main class="main-content">
      <router-view />
    </v-main>
    <app-footer v-if="isHomePage || isEnderecoPage || isPerfilPage || isProdutoPage || isProdutoPage2 || dashboard"  />
  </v-app>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import AppFooter from './components/footer.vue'
  import AppHeader from './components/header.vue'

  const route = useRoute()
  const isHomePage = computed(() => route.path === '/')
  const isProdutoPage2 = computed(() => route.path.startsWith('/produto/'))
  const isPerfilPage = computed(() => route.path === '/perfil')
  const isEnderecoPage = computed(() => route.path === '/enderecos')
  const isProdutoPage = computed(() => route.path === '/produtoCriar')
  const dashboard = computed(() => route.path === '/dashboard')
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
  background-color: #fff;
}
</style>