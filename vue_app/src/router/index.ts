import { createRouter, createWebHistory } from 'vue-router';

import adminRoutes from "./admin";

const routes = [
  {
    path: "/",
    name: "Models List",
    component: () => import("@/views/admin/ModelsList.vue"),
  },
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
