import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/Routes'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VueTheMask from 'vue-the-mask'
import vue3GoogleLogin from 'vue3-google-login'
import { createPinia } from 'pinia'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#6a11cb',
          secondary: '#2575fc',
          background: '#1a1a1a',
          surface: '#1a1a1a',
        }
      }
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(createPinia())
  .use(Vue3Toastify, {
    autoClose: 2500,
    position: toast.POSITION.TOP_RIGHT,
  })
  .use(VueTheMask as any)
  .use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  })
  .mount('#app')
