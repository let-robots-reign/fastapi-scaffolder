<template>
  <a-layout class="main-layout">
    <a-row class="main-row" type="flex" justify="center" align="top">
      <a-col :xs="10">
        <h1 class="heading">Список моделей</h1>
        <model-card
          v-for="model in modelsList"
          :key="model"
          :name="model"
          @click="$router.push({ name: 'Model Table', params: { modelName: model.toLowerCase() } })"
        />
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
// import api from "@/api/api";
import ModelCard from "@/components/ModelCard.vue";
import { ref } from "vue";

const modelsList = ref([]);
const getModelsList = async () => {
  try {
    // const res = await api.admin.modelsList();
    // modelsList.value = res.data;
    modelsList.value = ["User", "Doctor", "Pet"];
  } catch (e) {
    console.log("Error getting models list:", e);
  }
};

getModelsList();
</script>

<style lang="scss" scoped>
.main-row {
  padding-top: 50px;
}

.heading {
  font-size: 36px;
  line-height: 40px;
  margin-bottom: 32px;
  font-weight: 700;
}
</style>
