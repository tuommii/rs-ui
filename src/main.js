import { createApp } from 'vue'
import App from './App.vue'
import router from './modules/router'
import client from './modules/client'

const credit = {
	name: 'Miikka Tuominen'
}

const app = createApp(App)

// Test
app.config.globalProperties.$credit = credit

app.use(router)
app.mount('#app')
app.provide('$client', client);
