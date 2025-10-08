<template>
  <v-container fluid class="fill-height d-flex align-center justify-center bg-blue-darken-4">
    <v-card width="400" class="pa-6 rounded-xl elevation-10" color="blue-grey-lighten-3">
      <v-card-title class="text-center text-h5 font-weight-bold mb-4">Cadastro</v-card-title>

      <CadastroForm />

      <v-divider class="my-4"></v-divider>

      <v-btn block color="white" class="text-black" @click="loginGoogle">
        <v-icon start>mdi-google</v-icon>
        Continuar com Google
      </v-btn>

      <v-btn variant="text" class="mt-3" block @click="$router.push('/login')">
        Já tem conta? Entrar
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import CadastroForm from '../components/CadastroForm.vue'

function loginGoogle() {
  alert('Integração com Google aqui (Firebase / OAuth).')
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
