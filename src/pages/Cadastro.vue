<template>
  <main class="main">
    <v-form class="form" ref="form" @submit.prevent="handleSubmit">
      <span class="logo">
        <img src="../assets/" alt="Logo">
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
            v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
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
          :rules='[
            v => !!v || "Senha é obrigatória",
            v => v.length >= 6 || "Senha deve ter pelo menos 6 caracteres",
            v => /[A-Z]/.test(v) || "Senha deve conter ao menos uma letra maiúscula",
            v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || "Senha deve conter ao menos um caractere especial"
          ]'
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          class="custom-input"
          required
        />

        <v-text-field v-model="telefone" label="Telefone" maxlength="11"
          :rules="[
            v => !!v || 'Telefone é obrigatório',
            v => v.replace(/\D/g, '').length === 11 || 'Telefone deve ter 11 dígitos'
          ]"
          variant="outlined"
          prepend-inner-icon="mdi-phone"
          class="custom-input"
          v-mask="'(##) #####-####'"
          
          required
        />

        <v-text-field v-model="cpf" label="CPF"
          :rules="[
            v => !!v || 'CPF é obrigatório',
            v => validarCPF(v) || 'CPF inválido'
          ]"
          variant="outlined"
          prepend-inner-icon="mdi-card-account-details"
          class="custom-input"
          v-mask="'###.###.###-##'"
          required
        />

        <v-btn type="submit" block:loading="loading" class="submit-btn">Cadastrar-se</v-btn>
        <v-btn variant="text" to="/login" class="login-link">Já tem uma conta? Fazer login</v-btn>

    </v-form>
  </main>
</template>

<style scoped>
.custom-main {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-image: 
    linear-gradient(45deg, #FF6B6B, #8C52FF),
    url('https://www.transparenttextures.com/patterns/cream-pixels.png');
  background-blend-mode: overlay;
  background-size: auto; /* Adicionar esta linha */
  background-repeat: repeat; /* Adicionar esta linha */
  background-position: center; /* Adicionar esta linha */
  background-attachment: fixed; /* Adicionar esta linha */
  font-family: 'Poppins', sans-serif;
  position: fixed; /* Adicionar esta linha */
  top: 0; /* Adicionar esta linha */
  left: 0; /* Adicionar esta linha */
  right: 0; /* Adicionar esta linha */
  bottom: 0; /* Adicionar esta linha */
}

.custom-form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-in-out;
}

.logo-wrapper {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 50%;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.logo {
  width: 80px;
  height: auto;
}

.form-content {
  margin-top: 2rem;
}

.form-title {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
}

.custom-input {
  margin-bottom: 1rem;
}

:deep(.v-field__outline) {
  color: rgba(140, 82, 255, 0.2) !important;
}

:deep(.v-field__input) {
  color: #333 !important;
}

:deep(.v-label) {
  color: #666 !important;
}

.submit-btn {
  margin-top: 1.5rem;
  background: linear-gradient(45deg, #FF6B6B, #8C52FF) !important;
  color: white !important;
  height: 48px;
  font-size: 1.1rem;
  text-transform: none;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(140, 82, 255, 0.3);
}

.login-link {
  margin-top: 1rem;
  color: #8C52FF !important;
  font-weight: 500;
  text-transform: none;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #FF6B6B !important;
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
  .custom-form-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .logo-wrapper {
    top: -40px;
  }

  .logo {
    width: 60px;
  }

  .form-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .custom-form-container {
    max-width: 400px;
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

    function validarCPF(cpf: string): boolean {
      cpf = cpf.replace(/\D/g, '')
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
      let sum = 0, rest
      for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
      rest = (sum * 10) % 11
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(cpf.substring(9, 10))) return false
      sum = 0
      for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
      rest = (sum * 10) % 11
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(cpf.substring(10, 11))) return false
      return true
    }

  const validateForm = (): boolean => {
    if (!nome || !email || !password || !telefone) {
      toast.error("Preencha todos os campos obrigatórios.")
      return false
    }
    if (password.value.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.")
      return false
    }
    if (telefone.value.replace(/\D/g, "").length !== 11) {
      toast.error("Telefone deve ter 11 dígitos (DDD + número).")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    loading.value = true
    try {
      const res = await api.post("/usuario", {
        nome: nome.value,
        email: email.value,
        password: password.value,
        telefone: telefone.value.replace(/\D/g, ""),
        cpf: cpf.value.replace(/\D/g, ""),
      })

      if (res.status === 201) {
        toast.success("Usuário cadastrado com sucesso!")
        setTimeout(() => router.push("/login"), 1600)
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Erro no backend:", error.response.data)

        const msg = error.response.data.message
        if (typeof msg === "string") {
          toast.error(msg)
        } else if (typeof msg === "object") {
          const firstError = Object.values(msg)[0]
          toast.error(String(firstError))
        } else {
          toast.error("Erro ao cadastrar usuário")
        }
      } else {
        console.error(error)
        toast.error("Erro de conexão com servidor")
      }
    } finally {
      loading.value = false
    }
  }
</script>

