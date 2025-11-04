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
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-card width="260">
        <v-card-text v-if="cliente.length > 0" class="text-center">
          <v-avatar size="70" class="mx-auto mb-2">
            <v-img
              :src="fotoPerfil"
              alt="Foto de perfil"
              @click="abrirUpload"
              class="cursor-pointer"
            />
          </v-avatar>

          <v-btn text color="primary" size="small" @click="abrirUpload">
            Trocar Foto
          </v-btn>

          <input
            ref="inputFile"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFotoChange"
          />
        </v-card-text>

        <v-divider />

        <v-list dense nav>
          <v-list-item
            v-if="cliente[0]?.ativo"
            :to="{ path: '/meusAgendamentos' }"
            title="Meus Agendamentos"
            prepend-icon="mdi-calendar-check"
          />

          <template v-if="cliente[0]?.admin">
            <v-list-item :to="{ path: '/clientes' }" title="Clientes" prepend-icon="mdi-account-group" />
            <v-list-item :to="{ path: '/agendamentos' }" title="Agendamentos" prepend-icon="mdi-clock" />
            <v-list-item :to="{ path: '/funcionarios' }" title="Funcionários" prepend-icon="mdi-briefcase-account" />
            <v-list-item :to="{ path: '/semana' }" title="Semana" prepend-icon="mdi-calendar" />
          </template>

          <v-divider />

          <v-list-item
            v-if="cliente.length > 0"
            @click="logout"
            title="Logout"
            prepend-icon="mdi-logout"
          />
          <v-list-item
            v-else
            :to="{ path: '/login' }"
            title="Login"
            prepend-icon="mdi-login"
          />
        </v-list>
      </v-card>
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

    const { data } = await api.get('/usuario', { params: { id } })
    cliente.value = data

    fotoPerfil.value = data[0]?.imagem
      ? `data:image/png;base64,${data[0].imagem}`
      : '/default-profile.png'
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
  }
}

const abrirUpload = () => inputFile.value?.click()

const handleFotoChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    try {
      const formData = new FormData()
      formData.append('imagem', file)

      const userStorage = localStorage.getItem('usuario')
      if (!userStorage) return
      const { id } = JSON.parse(userStorage)

      await api.patch(`/usuario/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Foto atualizada com sucesso!')
      await pegarUsuario()
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
      toast.error('Erro ao salvar foto.')
    }
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
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
