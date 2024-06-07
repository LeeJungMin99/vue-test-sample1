import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import siteRouter from "./router";
import "./assets/tailwind.css";

const app = createApp(App);

app.use(siteRouter);
app.use(createPinia());
app.mount("#app");
