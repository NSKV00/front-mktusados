<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field v-model="form.nome" label="Nome Completo" prepend-inner-icon="mdi-account" required />
    <v-text-field v-model="form.email" label="E-mail" type="email" prepend-inner-icon="mdi-email" required />
    <v-text-field v-model="form.senha" label="Senha" type="password" prepend-inner-icon="mdi-lock" required />
    <v-text-field v-model="form.confirmarSenha" label="Confirmar Senha" type="password" prepend-inner-icon="mdi-lock-check" required />
    <v-text-field v-model="form.idade" label="Idade" type="number" prepend-inner-icon="mdi-cake-variant" />
    <v-text-field v-model="form.telefone" label="Telefone" prepend-inner-icon="mdi-phone" />
    <v-text-field v-model="form.cpf" label="CPF" prepend-inner-icon="mdi-card-account-details" />

    <v-checkbox v-model="form.aceite" label="Aceito os termos de uso e privacidade" />

    <v-btn
      type="submit"
      color="blue-darken-2"
      block
      class="mt-2"
      :disabled="!form.aceite"
    >
      Cadastrar-se
    </v-btn>
  </v-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  idade: '',
  telefone: '',
  cpf: '',
  aceite: false,
})

function handleSubmit() {
  if (form.senha !== form.confirmarSenha) {
    alert('As senhas não coincidem.')
    return
  }
  console.log('Dados enviados:', form)
  alert('Cadastro realizado com sucesso!')
}
</script>
