<template>
  <div class="profile-page">
    <div v-if="usuario" class="profile-container">

    <button class="config-btn" aria-label="Configurações" @click="abrirModal">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    </button>

      <div class="profile-header">
        <div class="avatar-wrapper">
          <img
            v-if="fotoSrc"
            :src="fotoSrc"
            alt="avatar"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>

        <div class="user-info">
          <h2 class="user-name">{{ usuario.nome || '-' }}</h2>
          <p class="user-email">{{ usuario.email || '-' }}</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-card">
          <strong>Telefone</strong>
          <p>{{ usuario.telefone || usuario.telefones || '-' }}</p>
        </div>
        <div class="detail-card">
          <strong>CPF</strong>
          <p>{{ usuario.cpf || '-' }}</p>
        </div>
        <div class="detail-card">
          <strong>Idade</strong>
          <p>{{ usuario.idade || usuario.age || '-' }}</p>
        </div>
        <div class="detail-card">
          <strong>Email</strong>
          <p>{{ usuario.email || '-' }}</p>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      Carregando perfil...
    </div>


    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-container">
        <h2>Editar Usuário</h2>
        <form @submit.prevent="salvarDados">
          <label>
            Nome:
            <input type="text" v-model="form.nome"/>
          </label>
          <label>
            Telefone:
            <input type="text" v-model="form.telefone"/>
          </label>
          <label>
            CPF:
            <input type="text" v-model="form.cpf"/>
          </label>
          <label>
            Idade:
            <input type="number" v-model="form.idade"/>
          </label>
          <div class="modal-buttons">
            <button type="button" @click="fecharModal">Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.profile-container {
  position: relative; 
  width: 80%;
  max-width: 1200px;
  min-height: 300px;
  background-color: #fff;
  border-radius: 12px;
  border: 2px solid #fed5aa;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000000;
  transition: background 0.15s ease, transform 0.12s ease;
}

.config-btn:hover {
  background-color: #fed5aa;
  transform: scale(1.05);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fed5aa;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #666;
  background-color: #eee;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 0 0 auto; 
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.user-email {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.profile-details {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.detail-card {
  flex: 1 1 calc(50% - 16px);
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-card strong {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
  font-size: 14px;
}

.detail-card p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.loading {
  width: 80%;
  text-align: center;
  color: #666;
  font-size: 18px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-container h2 {
  margin: 0 0 12px 0;
}

.modal-container label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.modal-container input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.modal-buttons button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background: #f3f3f3;
}

.modal-buttons button:last-child {
  background: #fed5aa;
}

@media (max-width: 720px) {
  .profile-container {
    width: 95%;
    min-height: auto;
    padding: 18px;
  }
  .avatar-wrapper { width: 88px; height: 88px; }
  .profile-details { flex-direction: column; gap: 12px; }
  .detail-card { flex: 1 1 100%; }
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import  apiController  from "../controller/api"

const produtos = ref([])
const usuario = ref(null)
const imagemBase64 = ref('')
const modalAberto = ref(false)


const form = ref({
  nome: '',
  telefone: '',
  cpf: '',
  idade: ''
})

const fotoSrc = computed(() => {
  const b = imagemBase64.value
  if (!b || typeof b !== 'string') return null
  const trimmed = b.trim()
  if (trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed
  return `data:image/png;base64,${trimmed}`
})

onMounted(async () => {
     console.log("onMounted foi chamado!")
  try {
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjEyNjUyNjUsImV4cCI6MTc2MTI3MjQ2NSwiaWF0IjoxNzYxMjY1MjY1fQ.xSRTGrf9TFn1ceAO6uRbAo_sRHj4nPkL6leHi6YHpvo`
    };

    const [response, response2, response3] = await Promise.all([
      apiController.get("produto", {
        params: { usuarioId: 8 },
        headers
      }),
      apiController.get("usuarios", {
        params: { id: 8 },
        headers
      }),
      apiController.get("usuarioImagem/8", { headers })
    ]);

    if (response2?.data) {
      usuario.value = response2.data[0];
    }

    if (response?.data) {
      produtos.value = response.data;
    }

    if (response3?.data) {
      imagemBase64.value = response3.data.imagem;
    }

    form.value = {
    nome: usuario.value.nome || '',
    telefone: usuario.value.telefone || usuario.value.telefones || '',
    cpf: usuario.value.cpf || '',
    idade: usuario.value.idade || usuario.value.age || ''
    }


  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
  }
})


const abrirModal = () => modalAberto.value = true
const fecharModal = () => modalAberto.value = false

const salvarDados = () => {
  // Aqui você pode chamar a API para atualizar os dados
  console.log('Dados atualizados:', form.value)
  // Atualiza o objeto principal
  usuario.value = { ...usuario.value, ...form.value }
  fecharModal()
}
</script>