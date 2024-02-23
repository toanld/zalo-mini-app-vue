import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import AboutPage from './components/AboutPage.vue'

const routes = [
    { path: '/about',name:'about', component: AboutPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
