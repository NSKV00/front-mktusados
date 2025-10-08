import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/Routes'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
