import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import { createPinia } from 'pinia';
import router from './router';
// tailwindcss  样式库
// arco design UI 库
// ts type script


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ArcoVue);

app.mount('#app');
