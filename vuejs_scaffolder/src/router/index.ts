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
    {
      path: "/:modelName/:id",
      name: "Model Item",
      component: () => import("@/views/admin/ModelItem.vue"),
    },
  ]
});

export default router;
