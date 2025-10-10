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

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 2500,
    position: toast.POSITION.TOP_RIGHT,
  })
  .mount('#app')
