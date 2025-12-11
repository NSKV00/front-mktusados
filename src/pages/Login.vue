<template>
  <main class="main">
    <v-form class="form" ref="form" @submit.prevent="handleSubmit">
      <span class="logo">
        <img class="Logo" src="../assets/Logo.png" alt="Logo" />
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
        v-model="senha"
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

      <div class="divider">ou</div>

      <v-btn variant="text" @click="goToCadastro" class="login-link">Criar conta</v-btn>
    </v-form>
  </main>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { toast } from 'vue3-toastify'
  import api from '../controller/api'
  import { encryptJSON } from "../utils/crypto"

  const router = useRouter()

  const email = ref('')
  const senha = ref('')
  const loading = ref(false)
  const showPassword = ref(false)

  const validateForm = (): boolean => {
    if (!email.value || !senha.value) {
      toast.error("Preencha e-mail e senha.")
      return false
    }
    if (!/.+@.+\..+/.test(email.value)) {
      toast.error("E-mail inválido.")
      return false
    }
    return true
  };

  const retrieveUsuario = async () => {
    try {
      const { data } = await api.get("/retrieve");
      localStorage.setItem("usuario", encryptJSON(data));
    } catch (err) {
      console.error("Erro recuperando usuário:", err);
    }
  };

  const handleSubmit = async () => {
    await nextTick();
    if (!validateForm()) return;

    loading.value = true;

    try {
      const { data, status } = await api.post("/login", {
        email: email.value,
        senha: senha.value,
      });

      if (status === 200 || status === 201) {
        localStorage.setItem("token", data.token);
        await retrieveUsuario();
        toast.success("Login realizado!");
        setTimeout(() => router.push('/'), 2000)
      } else {
        toast.error("Falha no login.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro no servidor.");
    } finally {
      loading.value = false;
    }
  };

  const goToCadastro = () => router.push('/cadastro')
</script>

<style scoped>
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    height: 100%;
    font-family: 'Poppins', sans-serif;
    padding: var(--spacing-md);
    background-image: 
      linear-gradient(45deg, rgb(219, 219, 219), rgb(190, 190, 190), rgb(141, 141, 141), rgb(219, 219, 219)),
      url('https://www.transparenttextures.com/patterns/cream-pixels.png');
    background-blend-mode: overlay;
    background-size: auto;
    background-repeat: repeat;
    background-position: center;
    background-attachment: fixed;
    position: absolute;
    inset: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .form {
    background: rgba(26, 26, 26, 0.8);
    backdrop-filter: blur(8px);
    border-radius: 20px;
    padding: 1.5rem;
    max-width: 30rem;
    width: min(90%, 30rem);
    gap: 1rem;
    margin: 7.75rem auto 1.25rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.6s ease-in-out;
    position: relative;
  }

  .logo {
    position: absolute;
    left: 50%;
    top: -4.125rem;
    transform: translateX(-50%);
  }

  .Logo {
    width: var(--logo-size-desktop);
    height: auto;
  }

  .title {
    color: #fff;
    font-size: var(--font-xl);
    font-weight: 600;
    text-align: center;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  :deep(.v-field) {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
  }

  :deep(.v-field__label) {
    color: rgba(255,255,255,0.85);
  }

  :deep(.v-field__input) {
    color: #fff;
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem);
  }

  :deep(.v-field__prepend-inner) {
    padding-inline-start: clamp(0.75rem, 3vw, 1rem);
  }

  .custom-input {
    margin-top: 0.375rem;
  }

  .submit-btn,
  .google-btn {
    height: var(--input-height) !important;
    padding: 0 clamp(1rem, 4vw, 1.5rem);
    font-size: clamp(0.875rem, 2.5vw, 1rem);
  }

  .login-link {
    color: #fff;
    font-size: var(--font-sm);
    font-weight: 500;
    text-align: center;
    display: block;
    margin-top: 0.5rem;
    transition: color 0.3s;
  }
  .login-link:hover {
    color: #ffcc70 !important;
  }

  .divider {
    color: #fff;
    text-align: center;
    margin: 1rem 0;
    position: relative;
  }

  .divider::before,
  .divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 30px);
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .divider::before {
    left: 0;
  }

  .divider::after {
    right: 0;
  }

  .google-btn {
    background-color: white !important;
    color: #757575 !important;
    border: 1px solid #dadce0 !important;
    height: var(--input-height) !important;
    transition: all 0.2s ease;
  }

  .google-btn:hover {
    background-color: #f8f9fa !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

  @media (max-width: 37.5rem) {
    .main {
      padding: 0.5rem;
    }
    
    .form {
      gap: 0.75rem;
      padding: 1.25rem;
      margin-top: 2.5rem;
      width: 95%;
    }

    .logo {
      top: -2.188rem;
    }

    .Logo {
      width: var(--logo-size-mobile);
    }

    .title {
      font-size: var(--font-lg);
      margin-top: 1rem;
    }
  }

  @media (max-height: 37.5rem) {
    .form {
      gap: 0.5rem;
      padding: 1rem;
    }

    .title {
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
    }
  }
</style>