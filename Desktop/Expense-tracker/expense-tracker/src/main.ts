import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/router'
import { createRouter, createWebHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; 

const vuetify = createVuetify();

const app=createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
