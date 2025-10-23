<template>
  <div class="profile-page">
    <div v-if="usuario" class="profile-container">
      <!-- Cabeçalho: Avatar + Nome/Email -->
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

      <!-- Detalhes: agora em flex, com cards para cada info -->
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
          <p>{{ usuario.idade ?? usuario.age ?? '-' }}</p>
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
  </div>
</template>

<style scoped>
/* Página: fundo branco e centralizado */
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

/* Container do perfil */
.profile-container {
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

.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
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
    const response = await apiController.get('produto', {
      params: {
        usuarioId: 8
      },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjA2NTY0NjcsImV4cCI6MTc2MDY2MzY2NywiaWF0IjoxNzYwNjU2NDY3fQ.kUYKZVqEvsrSgb0BrIJkVb0I1pK29DNhRt7UjGCsJlE`
      }
    })

    const response2 = await apiController.get('usuarios', {
      params: {
        id: 8
      },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjA2NTY0NjcsImV4cCI6MTc2MDY2MzY2NywiaWF0IjoxNzYwNjU2NDY3fQ.kUYKZVqEvsrSgb0BrIJkVb0I1pK29DNhRt7UjGCsJlE`
      }
    })

    const response3 = await apiController.get('usuarioImagem/8', {

      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjEwODc1OTEsImV4cCI6MTc2MTA5NDc5MSwiaWF0IjoxNzYxMDg3NTkxfQ.P-4ARPGTUUxB1dDgXy6narmziQMcm8FZc6Q9qVf35n0`
      }
    })

    if (response2 && response2.data) {
          usuario.value = response2.data[0]
    }

    if (response && response.data) {
      produtos.value = response.data
    }

    if (response3 && response3.data) {
      imagemBase64.value = response3.data.imagem
    }


  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
  }
})
</script>