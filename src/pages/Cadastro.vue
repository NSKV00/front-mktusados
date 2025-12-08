<template>
  <main class="main">
    <v-form class="form" ref="formRef" @submit.prevent="handleSubmit">
      <span class="logo">
        <img class="Logo" src="../assets/logo.png" alt="Logo" />
      </span>

      <span class="title">Criar Conta</span>

      <v-text-field
        v-model="nome"
        label="Nome completo"
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
        :rules="regrasEmail"
        variant="outlined"
        prepend-inner-icon="mdi-email"
        class="custom-input"
        @input="validarFormatoEmail"
        :error-messages="erroEmail"
        required
      />

      <v-text-field
        v-model="senha"
        label="Senha"
        :type="mostrarSenha ? 'text' : 'password'"
        :rules="regrasSenha"
        variant="outlined"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="mostrarSenha = !mostrarSenha"
        class="custom-input"
        required
      />

      <template v-if="senha">
        <div class="password-strength">
          <v-progress-linear
            :model-value="(getForcaSenha(senha).strength / 6) * 100"
            :color="getForcaSenha(senha).color"
            height="4"
          />
          <span :class="['strength-text', `text-${getForcaSenha(senha).color}`]">
            {{ getForcaSenha(senha).text }}
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
        @input="validaTelefone"
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

      <v-text-field
        v-model.number="idade"
        label="Idade"
        :rules="[v => !!v || 'A idade é obrigatória', validarIdade]"
        variant="outlined"
        prepend-inner-icon="mdi-cake"
        class="custom-input"
         type="number"
        required
      />

      <v-checkbox
        v-model="aceitaTermos"
        color="primary"
        class="terms-checkbox"
        :rules="[v => !!v || 'Você deve aceitar os Termos e Condições para continuar']"
      >
        <template v-slot:label>
          <div class="checkbox-label">
            Eu li e aceito os 
            <a @click.stop="mostrarTermos = true" class="link-termos">
              Termos e Condições de Uso
            </a>.
          </div>
        </template>
      </v-checkbox>

      <v-dialog v-model="mostrarTermos" max-width="800px" persistent>
        <v-card>
          <v-card-title class="text-h6 font-weight-bold">
            Termos e Condições de Uso
          </v-card-title>
          <v-card-text style="max-height: 70vh; overflow-y: auto; white-space: pre-line;">
            {{ textoTermos }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="mostrarTermos = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-btn type="submit" :loading="carregando" class="submit-btn" block>
        Cadastrar-se
      </v-btn>

      <div class="divider">ou</div>

      <v-btn variant="text" @click="irParaLogin" class="login-link">Já tem uma conta? Fazer login</v-btn>
    </v-form>
  </main>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { toast } from 'vue3-toastify'
  import { useRouter } from 'vue-router'
  import api from '../controller/api'

  const router = useRouter()
  const nome = ref('')
  const email = ref('')
  const senha = ref('')
  const telefone = ref('')
  const cpf = ref('')
  const idade = ref <number | null>(null)

  const carregando = ref(false)
  const mostrarSenha = ref(false)

  const erroEmail = ref('')
  const erroTelefone = ref('')

  const PADRAO_TELEFONE = /^\(\d{2}\)\s\d{5}-\d{4}$/
  const TAMANHO_MINIMO_TELEFONE = 11

  const dddsValidos: Record<string, string[]> = {
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

  const obterTodosDDDs = () => Object.values(dddsValidos).flat()
  const verificarDDD = (ddd: string) => obterTodosDDDs().includes(ddd)

  const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  const dominiosComuns = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']

  const regrasEmail = [
    (v: string) => !!v || 'E-mail é obrigatório',
    (v: string) => v.length <= 254 || 'E-mail muito longo',
    (v: string) => v.includes('@') || 'E-mail deve conter @',
    (v: string) => {
      if (!v.includes('@')) return true
      const [parteLocal] = v.split('@')
      return parteLocal.length <= 64 || 'Parte local do e-mail muito longa'
    },
    (v: string) => {
      if (!v.includes('@')) return true
      const [, dominio] = v.split('@')
      if (!dominio) return true
      return dominio.length <= 255 || 'Domínio do e-mail muito longo'
    },
    (v: string) => {
      if (!v) return true
      return emailRegex.test(v) || 'Formato de e-mail inválido'
    }
  ]

  const regrasSenha = [
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

  const regrasTelefone = [
    (v: string) => !!v || 'Telefone é obrigatório',
    (v: string) => {
      const numeros = (v || '').replace(/\D/g, '')
      return numeros.length === TAMANHO_MINIMO_TELEFONE || 'Telefone deve ter 11 dígitos'
    },
    (v: string) => PADRAO_TELEFONE.test(v) || 'Formato inválido. Use (XX) XXXXX-XXXX',
    (v: string) => {
      const ddd = (v || '').replace(/\D/g, '').substring(0, 2)
      if (!verificarDDD(ddd)) {
        const estado = Object.entries(dddsValidos).find(([, ddds]) => ddds.includes(ddd))?.[0]
        return estado ? `DDD ${ddd} pertence ao estado ${estado}` : 'DDD inválido'
      }
      return true
    }
  ]

  const getLevenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null))

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const custo = a[i - 1] === b[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + custo
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

  const validaTelefone = () => {
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

    if (/^(\d)\1+$/.test(numeros)) {
      erroTelefone.value = 'Número de telefone inválido (dígitos repetidos)'
      return
    }

    erroTelefone.value = ''
  }

  const validarFormatoEmail = () => {
    if (!email.value) {
      erroEmail.value = ''
      return
    }

    if (!email.value.includes('@')) {
      erroEmail.value = ''
      return
    }

    const [localPart, domain] = email.value.split('@')
    if (domain) {
      const similar = dominiosComuns.find(d => getLevenshteinDistance(domain.toLowerCase(), d) <= 2)
      if (similar && domain.toLowerCase() !== similar) {
        erroEmail.value = `Você quis dizer ${localPart}@${similar}?`
        return
      }
    }

    if (email.value.includes('..')) {
      erroEmail.value = 'E-mail não pode conter pontos consecutivos'
      return
    }

    if (email.value.startsWith('.') || email.value.endsWith('.')) {
      erroEmail.value = 'E-mail não pode começar ou terminar com ponto'
      return
    }

    if (localPart && localPart.length > 64) {
      erroEmail.value = 'Parte local do e-mail muito longa'
      return
    }

    erroEmail.value = ''
  }

  const getForcaSenha = (senhaStr: string): { strength: number; color: string; text: string } => {
    let strength = 0
    if (!senhaStr) return { strength: 0, color: 'error', text: 'Muito fraca' }

    if (senhaStr.length >= 8) strength++
    if (/[A-Z]/.test(senhaStr)) strength++
    if (/[a-z]/.test(senhaStr)) strength++
    if (/[0-9]/.test(senhaStr)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(senhaStr)) strength++
    if (senhaStr.length >= 12) strength++

    const mapa = {
      0: { color: 'error', text: 'Muito fraca' },
      1: { color: 'error', text: 'Fraca' },
      2: { color: 'warning', text: 'Média' },
      3: { color: 'info', text: 'Boa' },
      4: { color: 'success', text: 'Forte' },
      5: { color: 'success', text: 'Muito forte' },
      6: { color: 'success', text: 'Excelente' }
    } as Record<number, { color: string; text: string }>

    return {
      strength,
      color: mapa[strength].color,
      text: mapa[strength].text
    }
  }

  function validarIdade(valor: number) {
    if (!valor) return 'Informe sua idade'
    if (valor < 16) return 'Você precisa ter pelo menos 16 anos para se cadastrar'
    return true
  }



  const validarFormulario = (): boolean => {
    if (!nome.value || !email.value || !senha.value || !telefone.value) {
      toast.error('Preencha todos os campos obrigatórios.')
      return false
    }

    if (senha.value.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.')
      return false
    }

    const numerosTelefone = telefone.value.replace(/\D/g, '')
    if (numerosTelefone.length !== TAMANHO_MINIMO_TELEFONE) {
      toast.error('Telefone deve ter 11 dígitos (DDD + número).')
      return false
    }

    if (!PADRAO_TELEFONE.test(telefone.value)) {
      toast.error('Formato de telefone inválido. Use (XX) XXXXX-XXXX.')
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

    if (!idade.value || idade.value < 16) {
    toast.error('Você precisa ter pelo menos 16 anos para se cadastrar.')
    return false
    }

    if (erroEmail.value) {
      toast.error(erroEmail.value)
      return false
    }
    if (erroTelefone.value) {
      toast.error(erroTelefone.value)
      return false
    }
    if (!aceitaTermos.value) {
    toast.error('Você deve aceitar os Termos e Condições para continuar.')
    return false
  }

    return true
  }

  const handleSubmit = async () => {
    if (!validarFormulario()) return

    carregando.value = true
    try {
      const res = await api.post('/usuarios',{
        nome: nome.value,
        email: email.value,
        senha: senha.value,
        telefone: telefone.value.replace(/\D/g, ''),
        cpf: cpf.value.replace(/\D/g, ''),
        idade: idade.value
      })

      if (res.status === 201 || res.status === 200) {
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
      carregando.value = false
    }
  }

  const aceitaTermos = ref(false)
  const mostrarTermos = ref(false)

  const textoTermos = `
  🔹 1. Introdução
  Bem-vindo à nossa plataforma de vendas de produtos novos e usados. Ao se cadastrar e utilizar o site, você concorda com os presentes Termos e Condições de Uso.

  🔹 2. Cadastro e Responsabilidade
  O usuário deve fornecer informações verdadeiras, atualizadas e completas. O uso indevido de dados falsos ou de terceiros é proibido e pode resultar na exclusão da conta.

  🔹 3. Compra e Venda
  - O vendedor é responsável pela veracidade e condição dos produtos anunciados.
  - O comprador deve verificar atentamente a descrição, preço e estado do item antes de efetuar a compra.
  - A plataforma atua apenas como intermediadora de contato e pagamento, não sendo parte direta da negociação.

  🔹 4. Produtos Usados
  Itens classificados como "usados" devem conter informações claras sobre defeitos, desgaste e funcionalidade. Produtos falsificados, roubados ou ilícitos são estritamente proibidos.

  🔹 5. Pagamentos e Segurança
  Os pagamentos devem ser realizados apenas por meios autorizados e seguros pela plataforma. Tentativas de fraude, chargeback indevido ou uso de cartões de terceiros resultarão em bloqueio imediato da conta.

  🔹 6. Entregas e Devoluções
  O prazo de envio é de responsabilidade do vendedor. O comprador pode abrir disputa em caso de não recebimento ou produto divergente. Devoluções devem seguir as políticas da plataforma.

  🔹 7. Propriedade Intelectual
  Todo o conteúdo (imagens, textos, logos) é protegido por direitos autorais. O uso sem autorização é proibido.

  🔹 8. Privacidade e Proteção de Dados
  As informações pessoais são coletadas apenas para fins de operação da plataforma e respeitam a Lei Geral de Proteção de Dados (LGPD).

  🔹 9. Penalidades e Suspensões
  A plataforma se reserva o direito de suspender ou excluir contas que violem estes termos, realizem fraudes ou prejudiquem outros usuários.

  🔹 10. Alterações dos Termos
  Os Termos de Uso podem ser atualizados a qualquer momento. O uso contínuo da plataforma implica aceitação das novas condições.

  🔹 11. Contato
  Dúvidas ou reclamações podem ser enviadas pelo canal de suporte disponível na plataforma.
  `

  const irParaLogin = () => router.push('/login')
</script>

<style scoped>
  .main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
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
    background: rgba(26, 26, 26, 0.9);
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

  .checkbox-label {
    color: #fff;
    font-size: 14px;
  }

  .idade-tag {
    margin-top: 6px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .maior18 {
    color: #2e7d32;
  }

  .maior16 {
    color: #f9a825;
  }

  .custom-input {
    margin-top: 0.375rem;
  }

  .terms-checkbox {
    margin-top: 8px;
    color: #fff;
  }

  .checkbox-label {
    color: #fff;
    font-size: 14px;
  }

  .link-termos {
    color: #ffcc70;
    cursor: pointer;
    text-decoration: underline;
  }

  .link-termos:hover {
    color: #ffd98e;
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