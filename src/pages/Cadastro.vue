<template>
  <main class="main">
    <v-form class="form" ref="form" @submit.prevent="handleSubmit">
      <span class="logo">
        <img class="Logo" src="../assets/logo.png" alt="Logo" />
      </span>

      <span class="title">Criar Conta</span>

      <v-text-field
        v-model="nome"
        label="Nome Completo"
        :rules="[v => !!v || 'Nome completo é obrigatório']"
        variant="outlined"
        prepend-inner-icon="mdi-account"
        class="custom-input"
        required
      />

      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        :rules="[
          v => !!v || 'E-mail é obrigatório',
          v => /.+@.+\\..+/.test(v) || 'E-mail deve ser válido'
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
          v => !!v || 'Senha é obrigatória',
          v => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
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
        maxlength="15"
        :rules="[
          v => !!v || 'Telefone é obrigatório',
          v => v.replace(/\\D/g, '').length === 11 || 'Telefone deve ter 11 dígitos'
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
        :rules="[v => !!v || 'CPF é obrigatório', v => validarCPF(v) || 'CPF inválido']"
        variant="outlined"
        prepend-inner-icon="mdi-card-account-details"
        class="custom-input"
        v-mask="'###.###.###-##'"
        required
      />

      <v-btn type="submit" :loading="loading" class="submit-btn" block> Cadastrar-se </v-btn>

      <v-btn variant="text" @click="goToLogin" class="login-link">Já tem uma conta? Fazer login</v-btn>
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
  background: var(--preto-intenso-tr);
  backdrop-filter: blur(0.1rem);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.6s ease-in-out;
  position: relative;
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
}

.title {
  position: relative;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
  top: 1.6rem;
}

:deep(.v-field) {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
}

:deep(.v-field__label) {
  color: rgba(255,255,255,0.85);
}

:deep(.v-field__input) {
  color: #fff;
}

.custom-input {
  margin-top: 0.4rem;
}

.submit-btn {
  margin-top: 0.4rem;
  background: linear-gradient(90deg,#6a11cb,#2575fc) !important;
  color: white !important;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
}

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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .form {
    padding: 20px;
    max-width: 340px;
    gap: 10px;
  }
  .logo {
    left: 34%;
    top: -2.8rem;
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

const nome = ref('')
const email = ref('')
const password = ref('')
const telefone = ref('')
const cpf = ref('')
const form = ref()
const loading = ref(false)
const showPassword = ref(false)

function validarCPF(cpfStr: string): boolean {
  const s = (cpfStr || '').replace(/\D/g, '')
  if (s.length !== 11 || /^(\d)\1+$/.test(s)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(s[i]) * (10 - i)
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(s[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(s[i]) * (11 - i)
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  return rev === parseInt(s[10])
}

const validateForm = (): boolean => {
  if (!nome.value || !email.value || !password.value || !telefone.value) {
    toast.error('Preencha todos os campos obrigatórios.')
    return false
  }
  if (password.value.length < 6) {
    toast.error('A senha deve ter pelo menos 6 caracteres.')
    return false
  }
  if (telefone.value.replace(/\D/g, '').length !== 11) {
    toast.error('Telefone deve ter 11 dígitos (DDD + número).')
    return false
  }
  if (!validarCPF(cpf.value)) {
    toast.error('CPF inválido.')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const res = await api.post('/usuario', {
      nome: nome.value,
      email: email.value,
      password: password.value,
      telefone: telefone.value.replace(/\D/g, ''),
      cpf: cpf.value.replace(/\D/g, ''),
    })

    if (res.status === 201) {
      toast.success('Usuário cadastrado com sucesso!')
      setTimeout(() => router.push('/login'), 1200)
    } else {
      toast.error('Erro ao cadastrar usuário.')
    }
  } catch (error: any) {
    if (error.response) {
      const msg = error.response.data?.message
      if (typeof msg === 'string') toast.error(msg)
      else if (typeof msg === 'object') toast.error(String(Object.values(msg)[0]))
      else toast.error('Erro ao cadastrar usuário')
      console.error('Erro backend:', error.response.data)
    } else {
      toast.error('Erro de conexão com servidor')
      console.error(error)
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => router.push('/login')
</script>

