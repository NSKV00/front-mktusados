<template>
  <v-app-bar class="header" style=".header" flat color="white">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="me-2" />

    <div class="logo">
      <img class="Logo" src="../assets/logo.png" alt="Logo" />
    </div>

    <v-spacer></v-spacer>

    <SearchFilter @update="handleFilterUpdate" />

    <v-spacer></v-spacer>

    <header class="profile-header">
      <div class="avatar-wrapper" @click="irPerfil" style="cursor: pointer;">
        <img v-if="fotoSrc" :src="fotoSrc" alt="avatar" class="avatar-img" />
        <div v-else class="avatar-placeholder">
          {{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}
        </div>
      </div>

      <div class="user-info">
        <h2 class="user-name">{{ usuario.nome || '-' }}</h2>
      </div>
    </header>

  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary app color="grey-lighten-4">
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
import SearchFilter from '../components/filtro.vue'
import emitter from '../utils/emitter'

const router = useRouter()
const drawer = ref(false)
const tokenLocal = localStorage.getItem('token')
const usuario = ref(tokenLocal ? jwtDecode(tokenLocal) as any : { nome: '' })
const imagemBase64 = ref('')
const isCarregando = ref(true)
// const form = ref({
//   id: '',
//   nome: '' as string
// })

const irPerfil = () => router.push('/perfil')

const handleFilterUpdate = (filters: any) => {
  console.log('Filtros aplicados:', filters)
  emitter.emit('applyFilters', filters)
}

const detectarTipoImagem = (base64: any) => {
  if (base64.startsWith('UklG')) return 'image/webp'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('iVBOR')) return 'image/png'
  return 'image/png'
}

const fotoSrc = computed(() => {
  if (!imagemBase64.value) return null
  const cleanedBase64 = imagemBase64.value.replace(/\s/g, '')
  const tipo = detectarTipoImagem(cleanedBase64)
  return `data:${tipo};base64,${cleanedBase64}`
})

onMounted(async () => {
     console.log("onMounted foi chamado!")
     console.log("Token local:", tokenLocal)
     console.log("ID do usuário:", usuario.value.id)
  try {
    isCarregando.value = true
    const headers = {
      Authorization: `Bearer ${tokenLocal}`
    };

    const [response, response2] = await Promise.all([
      api.get("usuarios", {
        params: { id:usuario.value.id },
        headers
      }),
      api.get(`usuarioImagem/${usuario.value.id}`, { headers })
    ]);

    if (response?.data) {
      usuario.value = response.data[0];
    }
    if (response2?.data) {
      imagemBase64.value = response2.data.imagem;
      console.log("Response2 completo:", response2.data)
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    isCarregando.value = false
  }
})
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
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
</style>
