import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Models List",
      component: () => import("@/views/admin/ModelsList.vue"),
    },
    {
      path: "/:modelName/list",
      name: "Model Table",
      component: () => import("@/views/admin/ModelTable.vue"),
    },
  ]
});

export default router;
