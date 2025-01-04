// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './routes/router'
// import { createRouter, createWebHistory } from 'vue-router';
// import { createVuetify } from 'vuetify';
// import 'vuetify/styles'; 

// const vuetify = createVuetify();

// const app=createApp(App)
// app.use(router)
// app.use(vuetify)
// app.mount('#app')



// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './routes/router';
// import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';
// import 'vuetify/styles';

// const vuetify = createVuetify({
//   components,
//   directives,
// });

// const app = createApp(App);
// app.use(router);
// app.use(vuetify);
// app.mount('#app');
import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
