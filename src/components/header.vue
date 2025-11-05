<template>
  <v-app-bar class="header" style=".header" flat color="white">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="me-2" />

    <div class="logo">
      <img class="Logo" src="../assets/logo.png" alt="Logo" />
    </div>

    <v-spacer></v-spacer>
    <v-text-field
      v-model="search"
      placeholder="Buscar..."
      prepend-inner-icon="mdi-magnify"
      hide-details
      dense
      flat
      class="search-bar"
    />
    <v-spacer></v-spacer>

    <v-menu
      v-model="menuUsuario"
      offset-y
      :close-on-content-click="false"
      transition="slide-y-transition"
      cli
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary app color="grey-lighten-4">
    <v-list nav dense>
      <v-list-item :to="{ path: '/' }" title="Home" prepend-icon="mdi-home" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import api from '../controller/api'

const router = useRouter()

interface ReturnUser {
  id: number
  nome: string
  email: string
  admin: boolean
  ativo: boolean
  imagem?: string
}

const drawer = ref(false)
const menuUsuario = ref(false)
const cliente = ref<ReturnUser[]>([])
const inputFile = ref<HTMLInputElement | null>(null)
const fotoPerfil = ref<string>('/default-profile.png')
const search = ref('')

const pegarUsuario = async () => {
  try {
    const valor = localStorage.getItem('usuario')
    if (!valor) return

    const userData = JSON.parse(valor)
    const id = userData.id || userData.usuario?.id
    if (!id) return

    const { data } = await api.get('/usuarioImagem', { params: { id } })
    cliente.value = data

    fotoPerfil.value = data[0]?.imagem
      ? `data:image/png;base64,${data[0].imagem}`
      : '/default-profile.png'
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
  }
}

onMounted(pegarUsuario)
</script>

<style scoped>
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
