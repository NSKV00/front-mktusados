<template>
  <v-app class="app">
    <app-header v-if="isHomePage || isEnderecoPage || isPerfilPage || isProdutoPage || isDetalhesProdutos" />
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
const isLoginPage = computed(() => route.path === '/login')
const isHomePage = computed(() => route.path === '/')
const isDetalhesProduto = computed(() => route.path.startsWith('/produtos/'))
const isDetalhesProdutos = computed(() => isHomePage.value || isDetalhesProduto.value)
const isPerfilPage = computed(() => route.path === '/perfil')
const isEnderecoPage = computed(() => route.path === '/enderecos')
const isProdutoPage = computed(() => route.path === '/produtoCriar')

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
