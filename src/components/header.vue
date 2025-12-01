<template>
  <v-app-bar class="header" style=".header" flat color="white" height="100">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="me-2" />

    <div class="logo">
      <router-link to="/" aria-label="Home">
        <img class="Logo" src="../assets/logo.png" alt="Logo" />
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <header class="profile-header">
      <div class="avatar-wrapper" @click="irPerfil" style="cursor: pointer;">
        <img v-if="fotoSrc" :src="fotoSrc" alt="avatar" class="avatar-img" />
        <div v-else class="avatar-placeholder">
          {{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}
        </div>
      </div>

    </header>

  </v-app-bar>

  <v-navigation-drawer v-model="drawer" class="list" style=".list" temporary app color="grey-lighten-4">
    <v-list nav dense>
      <v-list-item :to="{ path: '/' }" title="Home" prepend-icon="mdi-home" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../controller/api'
import { jwtDecode } from 'jwt-decode'
import emitter from '../utils/emitter'

const router = useRouter()
const drawer = ref(false)
const tokenLocal = localStorage.getItem('token')
const usuario = ref(tokenLocal ? jwtDecode(tokenLocal) as any : { nome: '' })
const imagemBase64 = ref('')
const search = ref('')
const isCarregando = ref(true)

const emit = defineEmits<{
  (e: 'update', filters: {
    search: string
  }): void
}>()

const irPerfil = () => router.push('/perfil')

const detectarTipoImagem = (base64: any) => {
  if (base64.startsWith('UklG')) return 'image/webp'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('iVBOR')) return 'image/png'
  return 'image/png'
}

const fotoSrc = computed(() => {
  if (!imagemBase64.value) return null
  const cleanedBase64 = imagemBase64.value.replace(/[\r\n\s]+/g, '')
  const tipo = detectarTipoImagem(cleanedBase64)
  return `data:${tipo};base64,${cleanedBase64}`
})

onMounted(async () => {
  if (!tokenLocal) {
    isCarregando.value = false
    return
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const user = await api.get("usuarios", {
      params: { id: usuario.value.id },
      signal: controller.signal
    })

    usuario.value = user.data[0]

    const img = await api.get(`usuarioImagem/${usuario.value.id}`, {
      signal: controller.signal
    })

    imagemBase64.value = img.data.imagem
    
    clearTimeout(timeoutId)
  } catch (error: any) {
    if (error.code !== 'ECONNABORTED') {
      console.error("Erro ao carregar header:", error)
    }
  } finally {
    isCarregando.value = false
  }
});


const emitUpdate = () => {
  emitter.emit('applyFilters', {
    search: search.value
  })
}
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-right: 1rem;
}

.avatar-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
  font-size: 24px;
  color: white;
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
}

.user-info .user-name {
  font-size: 16px;
  font-weight: 600;
}

.header {
  position: relative !important;
}

.header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(40deg, #372b73, #FF6B6B, #372b73);
}

.logo {
  display: flex;
  align-items: center;
  position: absolute;
  margin-left: 5.5rem;
}

.Logo {
  width: var(--logo-size-desktop);
  height: auto;
}

.search-bar {
  max-width: 600px;
  flex-grow: 1;
}

.cursor-pointer {
  cursor: pointer;
}

.hidden {
  display: none;
}

.search-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  position: relative;
}

.search-input {
  border-radius: 25px !important;
  background-color: #f5f5f5;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.search-input:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.search-input:focus-within {
  box-shadow: 0 0 0 2px #7e57c2;
  transform: scale(1.01);
}

.filter-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
</style>
