import { createRouter, createWebHistory } from 'vue-router'
import ModelsList from "@/views/ModelsList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Models List',
      component: ModelsList
    },
  ]
})

export default router
