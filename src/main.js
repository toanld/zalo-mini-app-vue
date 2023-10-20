import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from './components/AboutPage.vue'

const routes = [
    { path: '/about', component: AboutPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
