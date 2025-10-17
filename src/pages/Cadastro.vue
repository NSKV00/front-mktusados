<template>
  <main class="custom-main">
    <v-card class="custom-form">
      <div class="logo-container">
        <v-img src="../assets/Logo.png" alt="logo" width="120" class="logo-img" />
      </div>
      
      <h1 class="title">Criar Conta</h1>

      <v-form @submit.prevent="handleSubmit" ref="form" class="form-content">
        
        <v-text-field
          v-model="nome"
          label="Nome Completo"
          :rules="[ 
          (v: string) => !!v || 'Nome completo é obrigatório']"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          class="custom-input"
          required
        />

        
        <v-text-field
          v-model="email"
          label="E-mail"
          type="email"
          :rules=" [
            (v: string) => !!v || 'E-mail é obrigatório',
            (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
          ]"
          variant="outlined"
          prepend-inner-icon="mdi-email"
          class="custom-input"
          required
        />

        
        <v-text-field
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          :rules="[
            (v: string) => !!v || 'Senha é obrigatória',
            (v: string) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
          ]"
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          class="custom-input"
          required
        />

        
        <v-text-field
          v-model="telefone"
          label="Telefone"
          :rules="[
        (v: string) => !!v || 'Telefone é obrigatório',
        (v: string) => v.replace(/\D/g, '').length === 11 || 'Telefone deve ter 11 dígitos'
          ]"
          variant="outlined"
          prepend-inner-icon="mdi-phone"
          class="custom-input"
          v-mask="'(##) #####-####'"
          required
        />

        
        <v-text-field
          v-model="cpf"
          label="CPF"
          :rules="[
            (v: string) => !!v || 'CPF é obrigatório',
            (v: string) => v.replace(/\D/g, '').length === 11 || 'CPF inválido'
          ]"
          variant="outlined"
          prepend-inner-icon="mdi-card-account-details"
          class="custom-input"
          v-mask="'###.###.###-##'"
          required
        />

        
        <v-btn
          type="submit"
          block
          :loading="loading"
          class="custom-button"
        >
          Cadastrar-se
        </v-btn>

        <v-btn
          variant="text"
          to="/login"
          class="custom-link"
        >
          Já tem uma conta? Fazer login
        </v-btn>
      </v-form>
    </v-card>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../controller/api'

import { toast } from 'vue3-toastify'
import type { Ref } from 'vue'
import type { AxiosResponse, AxiosInstance } from 'axios'


const apiTyped = api as AxiosInstance




const router = useRouter()
const form = ref()
const loading = ref(false)
const showPassword = ref(false)

const nome = ref('')
const email = ref('')
const password = ref('')
const telefone = ref('')
const cpf = ref('')

const handleSubmit = () => {
  form.value
    .validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid) return
      loading.value = true
      return api.post("/usuario", {
        nome: nome.value,
        email: email.value,
        password: password.value,
        telefone: telefone.value.replace(/\D/g, ""),
        cpf: cpf.value.replace(/\D/g, ""),
      })
    })
    .then((res: AxiosResponse | void) => {
      if (!res) return
      if (res.status === 201) {
        toast.success("Usuário cadastrado com sucesso!")
        setTimeout(() => router.push("/login"), 2500)
      }
    })
    .catch((error: any) => {
      if (error && error.response) {
        console.error("Erro no backend:", error.response.data)
        const msg = error.response.data.message
        if (typeof msg === "string") {
          toast.error(msg)
        } else if (typeof msg === "object" && msg !== null) {
          const firstKey = Object.keys(msg)[0]
          const firstError = firstKey ? (msg as any)[firstKey] : msg
          toast.error(String(firstError))
        } else {
          toast.error("Erro ao cadastrar usuário")
        }
      } else {
        console.error(error)
        toast.error("Erro de conexão com servidor")
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.custom-main {
  background-color: var(--cinza-aço, #2c3e50);
  background-image: url('https://www.transparenttextures.com/patterns/cream-pixels.png');
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
}

.custom-form {
  background: var(--preto-intenso, #1a1a1a);
  backdrop-filter: blur(0.2rem);
  border-radius: 20px;
  padding: 3rem 2rem 2rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  animation: fadeIn 0.6s ease-in-out;
}

.logo-container {
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.title {
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.custom-input :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.15) !important;
}

.custom-input :deep(.v-field__input) {
  color: #fff !important;
}

.custom-input :deep(.v-label) {
  color: #e0e0e0 !important;
}

.custom-button {
  margin-top: 1rem;
  background: linear-gradient(90deg, #6a11cb, #2575fc) !important;
  border-radius: 25px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
}

.custom-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.custom-link {
  color: #fff !important;
  font-size: 14px;
  margin-top: 1rem;
  text-transform: none;
  transition: color 0.3s;
}

.custom-link:hover {
  color: #ffcc70 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .custom-form {
    padding: 2.5rem 1.5rem 1.5rem;
    max-width: 340px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 1.5rem;
  }

  .logo-container {
    top: -2.5rem;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .custom-form {
    max-width: 400px;
  }
}

@media (min-width: 961px) and (max-width: 1264px) {
  .custom-form {
    max-width: 440px;
  }
}

@media (min-width: 1265px) {
  .custom-form {
    max-width: 480px;
  }
}
</style>