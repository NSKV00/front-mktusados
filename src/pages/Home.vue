<template>
  <v-container fluid class="fill-height d-flex flex-column align-center justify-center bg-blue-darken-4 text-center text-white">
    <v-icon size="80" class="mb-4">mdi-home</v-icon>
    <h1 class="text-h4 font-weight-bold mb-2">Bem-vindo ao MKT Usados</h1>
    <p class="text-subtitle-1 mb-6">
      A melhor plataforma para compra e venda de produtos usados com segurança e praticidade.
    </p>

    <v-btn color="blue-grey-lighten-4" class="text-blue-darken-4 mb-3" @click="$router.push('/cadastro')">
      Criar conta
    </v-btn>

    <v-btn variant="outlined" color="white" @click="$router.push('/login')">
      Já tenho uma conta
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
