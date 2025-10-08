<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card
      class="pa-6"
      max-width="500"
      elevation="8"
      rounded="xl"
    >
      <v-card-title class="text-h5 text-center mb-4">
        Crie sua conta
      </v-card-title>

      <v-form v-model="formValid" @submit.prevent="cadastrarUsuario">
        <v-text-field
          v-model="usuario.nome"
          label="Nome completo"
          prepend-inner-icon="mdi-account"
          :rules="[rules.required]"
          outlined
          dense
          class="mb-3"
        />

        <v-text-field
          v-model="usuario.email"
          label="E-mail"
          prepend-inner-icon="mdi-email"
          :rules="[rules.required, rules.email]"
          outlined
          dense
          class="mb-3"
        />

        <v-text-field
          v-model="usuario.senha"
          label="Senha"
          type="password"
          prepend-inner-icon="mdi-lock"
          :rules="[rules.required, rules.password]"
          outlined
          dense
          class="mb-3"
        />

        <v-text-field
          v-model="usuario.confirmarSenha"
          label="Confirmar senha"
          type="password"
          prepend-inner-icon="mdi-lock-check"
          :rules="[rules.required, confirmSenha]"
          outlined
          dense
          class="mb-5"
        />

        <v-checkbox
          v-model="usuario.termos"
          :rules="[rules.requiredCheckbox]"
          label="Aceito os termos de uso"
          density="compact"
          hide-details="auto"
        />

        <v-btn
          :disabled="!formValid"
          color="primary"
          type="submit"
          block
          class="mt-4"
        >
          Cadastrar
        </v-btn>

        <v-divider class="my-4"></v-divider>

        <v-btn
          color="red-darken-1"
          block
          variant="outlined"
          @click="loginGoogle"
        >
          <v-icon start>mdi-google</v-icon>
          Entrar com Google
        </v-btn>

        <p class="text-center text-caption mt-4">
          Já tem uma conta?
          <RouterLink to="/login">Faça login</RouterLink>
        </p>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// ✅ Dados do usuário
const usuario = ref({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  termos: false,
})

// ✅ Controle do formulário
const formValid = ref(false)

// ✅ Regras de validação
const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) =>
    /.+@.+\..+/.test(v) || 'E-mail inválido',
  password: (v: string) =>
    v.length >= 6 || 'Mínimo de 6 caracteres',
  requiredCheckbox: (v: boolean) =>
    v || 'Você deve aceitar os termos',
}

// ✅ Confirmação de senha
const confirmSenha = (v: string) =>
  v === usuario.value.senha || 'As senhas não conferem'

// ✅ Função de cadastro
function cadastrarUsuario() {
  if (!formValid.value) return
  console.log('Usuário cadastrado:', usuario.value)
  alert(`Bem-vindo, ${usuario.value.nome}!`)
}

// ✅ Login via Google (placeholder)
function loginGoogle() {
  console.log('Login com Google...')
  alert('Login com Google em desenvolvimento')
}
</script>

<style scoped>
.v-card {
  background-color: #ffffff;
}

@media (max-width: 600px) {
  .v-card {
    margin: 0 12px;
  }
}
</style>
