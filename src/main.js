import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import siteRouter from "./router";
import "./assets/tailwind.css";
import vuetify from './plugins/vuetify'
import 'vuetify/styles'
// Axios 플러그인 추가
import axios from './plugins/axios'


const app = createApp(App);
// 전역 프로퍼티에 axios 추가
app.config.globalProperties.$axios = axios

app.use(siteRouter);
app.use(vuetify);
app.use(createPinia());
app.mount("#app");
