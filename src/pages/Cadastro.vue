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
        :rules="emailRules"
        variant="outlined"
        prepend-inner-icon="mdi-email"
        class="custom-input"
        @input="validateEmailFormat"
        :error-messages="emailError"
        required
      />

      <v-text-field
        v-model="password"
        label="Senha"
        :type="showPassword ? 'text' : 'password'"
        :rules="passwordRules"
        variant="outlined"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        class="custom-input"
        required
      />

      <template v-if="password">
        <div class="password-strength">
          <v-progress-linear
            :model-value="(getPasswordStrength(password).strength / 6) * 100"
            :color="getPasswordStrength(password).color"
            height="4"
          />
          <span :class="['strength-text', `text-${getPasswordStrength(password).color}`]">
            {{ getPasswordStrength(password).text }}
          </span>
        </div>
      </template>

      <v-text-field
        v-model="telefone"
        label="Telefone"
        maxlength="15"
        :rules="regrasTelefone"
        variant="outlined"
        prepend-inner-icon="mdi-phone"
        class="custom-input"
        v-mask="'(##) #####-####'"
        @input="validarTelefone"
        :error-messages="erroTelefone"
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

      <v-checkbox
        v-model="Maior16"
        color="primary"
        class="age-checkbox"
        :rules="[v => v || 'Você precisa ter mais de 16 anos para se cadastrar']"
      >
        <template v-slot:label>
          <div class="checkbox-label">
            Declaro que tenho 16 anos ou mais
          </div>
        </template>
      </v-checkbox>

      <v-btn type="submit" :loading="loading" class="submit-btn" block> Cadastrar-se </v-btn>

      <v-btn variant="text" @click="goToLogin" class="login-link">Já tem uma conta? Fazer login</v-btn>

      <div class="divider">ou</div>

      <v-btn
        @click="handleGoogleSignup"
        :loading="googleLoading"
        :disabled="!Maior16"
        class="google-btn"
        prepend-icon="mdi-google"
        variant="outlined"
        block
      >
        Cadastrar com Google
      </v-btn>
    </v-form>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: var(--spacing-md);
  background-image: 
    linear-gradient(45deg, #fdaf69, #FF6B6B, #372b73, #372b73),
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
  margin: 3.75rem auto 1.25rem;
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
  z-index: 1;
}

.Logo {
  width: var(--logo-size-desktop);
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.title {
  color: #fff;
  font-size: var(--font-xl);
  font-weight: 600;
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 0;
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
  padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem);
}

:deep(.v-field__prepend-inner) {
  padding-inline-start: clamp(0.75rem, 3vw, 1rem);
}

.age-checkbox {
  margin-top: 8px;
}

:deep(.age-checkbox .v-label) {
  opacity: 1;
}

.checkbox-label {
  color: #fff;
  font-size: 14px;
}

:deep(.v-checkbox .v-selection-control) {
  opacity: 1;
}

:deep(.v-checkbox .v-selection-control__input) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-checkbox--selected .v-selection-control__input) {
  color: #6a11cb !important;
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

.google-btn:hover:not(:disabled) {
  background-color: #f8f9fa !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.password-strength {
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.strength-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  text-align: right;
}

.text-error {
  color: #ff5252;
}

.text-warning {
  color: #ffd740;
}

.text-info {
  color: #2196f3;
}

.text-success {
  color: #4caf50;
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

@media (max-width: 37.5rem) { /* 600px */
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

<script setup lang="ts">
import { ref } from 'vue'
import api from '../controller/api'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { googleTokenLogin } from 'vue3-google-login'

const router = useRouter()

const nome = ref('')
const email = ref('')
const password = ref('')
const telefone = ref('')
const cpf = ref('')
const Maior16 = ref(false)
const form = ref()
const loading = ref(false)
const showPassword = ref(false)
const googleLoading = ref(false)
const emailError = ref('')
const erroTelefone = ref('')

// Constantes para validação do telefone
const PADRAO_TELEFONE = /^\(\d{2}\)\s\d{5}-\d{4}$/
const TAMANHO_MINIMO_TELEFONE = 11

// Lista de DDDs válidos por região
const dddsValidos = {
  SP: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
  RJ: ['21', '22', '24'],
  ES: ['27', '28'],
  MG: ['31', '32', '33', '34', '35', '37', '38'],
  PR: ['41', '42', '43', '44', '45', '46'],
  SC: ['47', '48', '49'],
  RS: ['51', '53', '54', '55'],
  DF: ['61'],
  GO: ['62', '64'],
  TO: ['63'],
  MT: ['65', '66'],
  MS: ['67'],
  AC: ['68'],
  RO: ['69'],
  BA: ['71', '73', '74', '75', '77'],
  SE: ['79'],
  PE: ['81', '87'],
  AL: ['82'],
  PB: ['83'],
  RN: ['84'],
  CE: ['85', '88'],
  PI: ['86', '89'],
  PA: ['91', '93', '94'],
  AM: ['92', '97'],
  RR: ['95'],
  AP: ['96'],
  MA: ['98', '99']
}

// Função para obter todos os DDDs válidos
const obterTodosDDDs = () => {
  return Object.values(dddsValidos).flat()
}

// Função para verificar se um DDD é válido
const verificarDDD = (ddd: string): boolean => {
  return obterTodosDDDs().includes(ddd)
}

// Regras de validação do telefone
const regrasTelefone = [
  (v: string) => !!v || 'Telefone é obrigatório',
  (v: string) => {
    const numeros = v.replace(/\D/g, '')
    return numeros.length === TAMANHO_MINIMO_TELEFONE || 'Telefone deve ter 11 dígitos'
  },
  (v: string) => PADRAO_TELEFONE.test(v) || 'Formato inválido. Use (XX) XXXXX-XXXX',
  (v: string) => {
    const ddd = v.replace(/\D/g, '').substring(0, 2)
    if (!verificarDDD(ddd)) {
      const estado = Object.entries(dddsValidos).find(([, ddds]) => ddds.includes(ddd))?.[0]
      return estado ? `DDD ${ddd} pertence ao estado ${estado}` : 'DDD inválido'
    }
    return true
  }
]

// Função de validação do telefone
const validarTelefone = () => {
  if (!telefone.value) {
    erroTelefone.value = ''
    return
  }

  const numeros = telefone.value.replace(/\D/g, '')
  
  if (numeros.length !== TAMANHO_MINIMO_TELEFONE) {
    erroTelefone.value = 'Telefone deve ter 11 dígitos (DDD + número)'
    return
  }

  if (!PADRAO_TELEFONE.test(telefone.value)) {
    erroTelefone.value = 'Formato inválido. Use (XX) XXXXX-XXXX'
    return
  }

  const ddd = numeros.substring(0, 2)
  if (!verificarDDD(ddd)) {
    erroTelefone.value = 'DDD inválido'
    return
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numeros)) {
    erroTelefone.value = 'Número de telefone inválido (dígitos repetidos)'
    return
  }

  erroTelefone.value = ''
}

const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/

const commonDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']

const emailRules = [
  (v: string) => !!v || 'E-mail é obrigatório',
  (v: string) => v.length <= 254 || 'E-mail muito longo',
  (v: string) => v.includes('@') || 'E-mail deve conter @',
  (v: string) => {
    if (!v.includes('@')) return true
    const [localPart] = v.split('@')
    return localPart.length <= 64 || 'Parte local do e-mail muito longa'
  },
  (v: string) => {
    if (!v.includes('@')) return true
    const [, domain] = v.split('@')
    if (!domain) return true
    return domain.length <= 255 || 'Domínio do e-mail muito longo'
  },
  (v: string) => {
    if (!v) return true
    return emailRegex.test(v) || 'Formato de e-mail inválido'
  }
]

const validateEmailFormat = () => {
  if (!email.value) {
    emailError.value = ''
    return
  }

  if (!email.value.includes('@')) {
    emailError.value = ''
    return
  }

  const [localPart, domain] = email.value.split('@')

  if (domain) {
    const similarDomain = commonDomains.find(d => 
      getLevenshteinDistance(domain.toLowerCase(), d) <= 2
    )
    
    if (similarDomain && domain.toLowerCase() !== similarDomain) {
      emailError.value = `Você quis dizer ${localPart}@${similarDomain}?`
      return
    }
  }

  if (email.value.includes('..')) {
    emailError.value = 'E-mail não pode conter pontos consecutivos'
    return
  }

  if (email.value.startsWith('.') || email.value.endsWith('.')) {
    emailError.value = 'E-mail não pode começar ou terminar com ponto'
    return
  }

  if (localPart && localPart.length > 64) {
    emailError.value = 'Parte local do e-mail muito longa'
    return
  }

  emailError.value = ''
}

const getLevenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = Array(b.length + 1).fill(null).map(() => 
    Array(a.length + 1).fill(null)
  )

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitute = matrix[j - 1][i - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        substitute
      )
    }
  }

  return matrix[b.length][a.length]
}

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

const passwordRules = [
  (v: string) => !!v || 'Senha é obrigatória',
  (v: string) => v.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
  (v: string) => /[A-Z]/.test(v) || 'Senha deve conter pelo menos uma letra maiúscula',
  (v: string) => /[a-z]/.test(v) || 'Senha deve conter pelo menos uma letra minúscula',
  (v: string) => /[0-9]/.test(v) || 'Senha deve conter pelo menos um número',
  (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Senha deve conter pelo menos um caractere especial',
  (v: string) => !/\s/.test(v) || 'Senha não pode conter espaços em branco',
  (v: string) => {
    const hasSequential = /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(v)
    return !hasSequential || 'Senha não pode conter sequências numéricas'
  },
  (v: string) => {
    const hasRepeating = /(.)\1{2,}/.test(v)
    return !hasRepeating || 'Senha não pode conter caracteres repetidos em sequência'
  }
]

const getPasswordStrength = (password: string): {
  strength: number,
  color: string,
  text: string
} => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  if (password.length >= 12) strength++
  
  const strengthMap = {
    0: { color: 'error', text: 'Muito fraca' },
    1: { color: 'error', text: 'Fraca' },
    2: { color: 'warning', text: 'Média' },
    3: { color: 'info', text: 'Boa' },
    4: { color: 'success', text: 'Forte' },
    5: { color: 'success', text: 'Muito forte' },
    6: { color: 'success', text: 'Excelente' }
  }

  return {
    strength: strength,
    color: strengthMap[strength as keyof typeof strengthMap].color,
    text: strengthMap[strength as keyof typeof strengthMap].text
  }
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

  // Validação completa do telefone
  const numerosTelefone = telefone.value.replace(/\D/g, '')
  if (numerosTelefone.length !== TAMANHO_MINIMO_TELEFONE) {
    toast.error('Telefone deve ter 11 dígitos (DDD + número).')
    return false
  }

  if (!PADRAO_TELEFONE.test(telefone.value)) {
    toast.error('Formato de telefone inválido.')
    return false
  }

  const ddd = numerosTelefone.substring(0, 2)
  if (!verificarDDD(ddd)) {
    toast.error('DDD inválido.')
    return false
  }

  if (/^(\d)\1+$/.test(numerosTelefone)) {
    toast.error('Número de telefone inválido (dígitos repetidos).')
    return false
  }

  if (!validarCPF(cpf.value)) {
    toast.error('CPF inválido.')
    return false
  }
  if (!Maior16.value) {
    toast.error('Você precisa ter mais de 16 anos para se cadastrar.')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const res = await api.create().post('/usuario', {
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

const handleGoogleSignup = async () => {
  if (!Maior16.value) {
    toast.error('Você precisa ter mais de 16 anos para se cadastrar.')
    return
  }

  googleLoading.value = true
  try {
    const { access_token } = await googleTokenLogin()
    
    // Get user info from Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    const googleData = await response.json()

    if (!googleData.email_verified) {
      throw new Error('Email do Google não verificado')
    }
    
    const res = await api.googleAuth.register({
      email: googleData.email,
      name: googleData.name,
      googleId: googleData.sub,
      picture: googleData.picture,
      isOver16: Maior16.value
    })

    if (res.status === 201) {
      toast.success('Conta criada com Google com sucesso!')
      
      // Store token or user data if needed
      // localStorage.setItem('token', res.data.token)
      
      // Redirect after short delay
      setTimeout(() => router.push('/'), 1200)
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error('Erro ao criar conta com Google')
      console.error(error)
    }
  } finally {
    googleLoading.value = false
  }
}

const goToLogin = () => router.push('/login')
</script>

