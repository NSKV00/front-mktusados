<template>
  <v-container fluid class="fill-height d-flex align-center justify-center bg-blue-darken-4">
    <v-card width="400" class="pa-6 rounded-xl elevation-10" color="blue-grey-lighten-3">
      <v-card-title class="text-center text-h5 font-weight-bold mb-4">Login</v-card-title>

      <v-form @submit.prevent="login">
        <v-text-field v-model="email" label="E-mail" type="email" prepend-inner-icon="mdi-email" required />
        <v-text-field v-model="senha" label="Senha" type="password" prepend-inner-icon="mdi-lock" required />
        <v-btn type="submit" color="blue-darken-2" block>Entrar</v-btn>
      </v-form>

      <v-divider class="my-4"></v-divider>

      <v-btn block color="white" class="text-black" @click="loginGoogle">
        <v-icon start>mdi-google</v-icon>
        Entrar com Google
      </v-btn>

      <v-btn variant="text" class="mt-3" block @click="$router.push('/cadastro')">
        Criar nova conta
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const senha = ref('')

function login() {
  alert(`Login: ${email.value}`)
}

function loginGoogle() {
  alert('Integração Google aqui (Firebase / OAuth).')
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
