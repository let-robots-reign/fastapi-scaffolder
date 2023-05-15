<template>
  <a-layout class="main-layout">
    <a-row class="main-row" type="flex" justify="center" align="top">
      <a-col :xs="10">
        <h1 class="heading">Список моделей</h1>
        <model-card
          v-for="model in modelsList"
          :key="model"
          :name="model"
          @click="$router.push({ name: `${model} Table` })"
        />
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import ModelCard from "@/components/ModelCard.vue";
// import api from "@/api/api";

@Component({
  components: { ModelCard }
})
export default class ModelsList extends Vue {
  modelsList: string[] = [];

  async getModelsList() {
    try {
      // const res = await api.admin.modelsList();
      // this.modelsList = res.data;
      this.modelsList = ["User", "Doctor", "Pet"];
    } catch (e) {
      console.log("Error getting models list:", e);
    }
  }

  created() {
    this.getModelsList();
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  padding-top: 50px;
}
</style>