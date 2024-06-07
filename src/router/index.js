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
  ],
});

export default siteRouter;
