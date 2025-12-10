<template>
  <v-app-bar class="header" flat color="white" height="100">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="me-2" />

    <div class="logo">
      <router-link to="/" aria-label="Home">
        <img class="Logo" src="../assets/logo.png" alt="Logo" />
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <header class="profile-header">
      <div class="avatar-wrapper" @click="irPerfil" style="cursor: pointer;">
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
    </header>
  </v-app-bar>

  <v-navigation-drawer
    ref="navDrawerRef"
    v-model="drawer"
    class="list"
    temporary
    app
    color="grey-lighten-4"
  >
    <v-list nav dense>
      <v-list-item :to="{ path: '/' }" title="Home" prepend-icon="mdi-home" />
      <v-list-item :to="{ path: '/perfil' }" title="Perfil" prepend-icon="mdi-account" />
      <v-list-item :to="{ path: '/enderecos' }" title="Endereços" prepend-icon="mdi-map-marker" />
      <v-list-item :to="{ path: '/dashboard' }" title="Dashboard" prepend-icon="mdi-view-dashboard" />
      <v-list-item :to="{ path: '/historico' }" title="Historico de Compras" prepend-icon="mdi-history" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import api from '../controller/api'

const router = useRouter()
const drawer = ref(false)
const navDrawerRef = ref<HTMLElement | null>(null)
const usuario = ref<any>({ nome: '' })
const imagemBase64 = ref('')

const tokenLocal = localStorage.getItem("token") || ""
const tokenValido =
  tokenLocal &&
  tokenLocal.split(".").length === 3 &&
  tokenLocal.split(".").every(p => p.length > 0)

if (tokenValido) {
  try {
    usuario.value = jwtDecode(tokenLocal)
  } catch (e) {
    console.warn("Token inválido")
  }
}

const fotoPadrao =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"

const detectarTipoImagem = (base64: string) => {
  if (base64.startsWith("UklG")) return "image/webp"
  if (base64.startsWith("/9j/")) return "image/jpeg"
  if (base64.startsWith("iVBOR")) return "image/png"
  return "image/png"
}

const fotoSrc = computed(() => {
  const b = imagemBase64.value

  if (!b || typeof b !== "string" || b.trim() === "") {
    return fotoPadrao
  }

  const trimmed = b.trim()

  if (trimmed.startsWith("data:")) return trimmed
  if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed

  const tipo = detectarTipoImagem(trimmed)
  return `data:${tipo};base64,${trimmed}`
})

const irPerfil = () => router.push("/perfil")

onMounted(async () => {
  if (!tokenValido) return

  try {
    const respUser = await api.get("usuarios", {
      params: { id: usuario.value.id },
      headers: { Authorization: `Bearer ${tokenLocal}` }
    })

    usuario.value = respUser.data[0]

    const img = await api.get(`usuarioImagem/${usuario.value.id}`)

    const base = img?.data?.imagem

    if (typeof base === "string" && base.trim() !== "") {
      imagemBase64.value = base.replace(/[\r\n\s]+/g, "")
    } else {
      imagemBase64.value = ""
    }
  } catch (error) {
    console.error("Erro ao carregar header:", error)
  }
})

const onDocumentClick = (e: MouseEvent) => {
  if (!drawer.value) return
  const drawerEl = navDrawerRef.value as HTMLElement | null
  const target = e.target as Node | null
  if (drawerEl && target && !drawerEl.contains(target)) {
    drawer.value = false
  }
}

watch(drawer, (val) => {
  if (val) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
})

onMounted(() => {
  document.addEventListener('click', onDocumentClick, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick, true)
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding-right: 1rem;
  }
  .me-2{
    position: relative !important;
    z-index: 10000 !important;



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
    width: var(--logo-size-mobile);
    height: auto;
  }
</style>
<style>
  /* Bloqueia rolagem do body quando o drawer estiver aberto */
  body.no-scroll {
    overflow: hidden !important;
  }
</style>