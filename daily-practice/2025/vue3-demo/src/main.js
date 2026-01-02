import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from '@/utils/mini-pinia'

const app = createApp(App);
app.use(createPinia()); // 安装
app.mount('#app');
