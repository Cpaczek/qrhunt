import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueQrcodeReader from "vue-qrcode-reader";
import './index.css'


createApp(App).use(router).use(VueQrcodeReader).mount('#app')
