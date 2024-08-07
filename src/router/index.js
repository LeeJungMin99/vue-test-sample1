import { createRouter, createWebHistory } from "vue-router";

const siteRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home", // ticket form
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/ticketlist",
      name: "ticketlist", // ticket list
      component: () => import("../views/TicketListView.vue"),
    },
    {
      path: "/ticket/:id",
      name: "ticket", // single ticket
      component: () => import("../views/TicketView.vue"),
    },
    {
      path: "/index1",
      name: "index1", // single ticket
      component: () => import("../views/IndexView1.vue"),
    },
    {
      path: "/index2",
      name: "index2", // single ticket
      component: () => import("../views/IndexView2.vue"),
    },
    {
      path: "/index3",
      name: "index3", // single ticket
      component: () => import("../views/IndexView3.vue"),
    },
    {
      path: "/index4",
      name: "index4", // single ticket
      component: () => import("../views/IndexView4.vue"),
    },
  ],
});

export default siteRouter;
