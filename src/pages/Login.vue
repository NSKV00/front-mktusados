<template>
  <main class="main">
    <v-form class="form" ref="form" @submit.prevent="handleSubmit">
      <span class="logo">
        <img class="Logo" src="../assets/logo.png" alt="Logo" />
      </span>

      <span class="title">Fazer Login</span>

      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail inválido']"
        variant="outlined"
        prepend-inner-icon="mdi-email"
        class="custom-input"
        required
      />

      <v-text-field
        v-model="password"
        label="Senha"
        :type="showPassword ? 'text' : 'password'"
        :rules="[v => !!v || 'Senha é obrigatória']"
        variant="outlined"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        class="custom-input"
        required
      />

      <v-btn type="submit" :loading="loading" class="submit-btn" block>
        Entrar
      </v-btn>

      <v-btn variant="text" @click="goToCadastro" class="login-link">Criar conta</v-btn>
    </v-form>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: 1rem;
  box-sizing: border-box;
  background-image: 
    linear-gradient(45deg, #FF6B6B, #8C52FF),
    url('https://www.transparenttextures.com/patterns/cream-pixels.png');
  background-blend-mode: overlay;
  background-size: auto;
  background-repeat: repeat;
  background-position: center;
  background-attachment: fixed;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.form {
  background: var(--preto-intenso);
  backdrop-filter: blur(0.2rem);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: fadeIn 0.6s ease-in-out;
  position: relative; /* para .logo absoluto */
  overflow: visible;
}

.logo {
  position: absolute;
  left: 35%;
  top: -3rem;
}

.Logo {
  width: 8rem;
  height: auto;
  display: block;
  border-radius: 50%;
  background: linear-gradient(90deg,#6a11cb,#2575fc);
  padding: 8px;
}

.title {
  position: relative;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
  top: 1.7rem;
}

/* Vuetify field overrides */
:deep(.v-field) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
}

:deep(.v-field__label) {
  color: rgba(255,255,255,0.85);
}

:deep(.v-field__input) {
  color: #fff;
}

.custom-input {
  margin-top: 0.6rem;
}

/* Botão */
.submit-btn {
  margin-top: 0.5rem;
  background: linear-gradient(90deg,#6a11cb,#2575fc) !important;
  color: white !important;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
}

/* Links abaixo */
.login-link {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  display: block;
  margin-top: 8px;
  transition: color 0.3s;
}
.login-link:hover {
  color: #ffcc70 !important;
}

/* Animação suave */
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
  .form {
    padding: 20px;
    max-width: 340px;
    gap: 12px;
  }
  .logo {
    left: 34%;
    top: -3em;
  }
  .Logo {
    width: 6rem;
  }
  .title {
    font-size: 22px;
    top: 2rem;
  }
  :deep(.v-field) {
    border-radius: 8px;
  }
  .submit-btn {
    height: 48px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .form {
    max-width: 420px;
    padding: 32px;
  }
  .Logo {
    width: 7rem;
  }
  .title {
    font-size: 24px;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../controller/api'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const form = ref()

const validateForm = (): boolean => {
  if (!email.value || !password.value) {
    toast.error('Preencha e-mail e senha.')
    return false
  }
  if (!/.+@.+\..+/.test(email.value)) {
    toast.error('E-mail inválido.')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value,
    })

    if (res.status === 200 || res.status === 201) {
      toast.success('Login realizado com sucesso!')
      router.push('/')
    } else {
      toast.error('Falha ao efetuar login.')
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Erro de conexão com o servidor.')
      console.error(error)
    }
  } finally {
    loading.value = false
  }
}

const goToCadastro = () => router.push('/cadastro')
</script>