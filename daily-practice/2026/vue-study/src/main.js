import { createApp } from 'vue'
import router from '@/router';
import store from '@/store';
// import App from './App.vue'
import App from './TaskList.vue' // 练习用

const app = createApp(App);
app.use(router).use(store).mount('#app');
