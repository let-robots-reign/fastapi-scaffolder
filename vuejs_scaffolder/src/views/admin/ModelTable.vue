<template>
  <a-layout class="main-layout table-layout">
    <base-section with-padding>
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :xs="15" :offset="2">
          <h1 class="heading">Список элементов модели {{ modelName }}</h1>
        </a-col>
        <a-col :xs="5" :offset="2">
          <base-button size="large" @click="createNewItem">Создать элемент</base-button>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col :xs="20">
          <base-table
            :data="data"
            :columns="columns"
            :total="total"
            :selected-rows="selectedRows"
            @row-checked-change="toggleSelectRow"
          >
            <template #id="{ item }">
              <router-link
                :to="{ name: 'Model Item', params: { modelName: modelName.toLowerCase(), id: item.id } }"
              >
                {{ item.id }}
              </router-link>
            </template>
          </base-table>
        </a-col>
      </a-row>
    </base-section>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { type Router, useRoute, useRouter } from "vue-router";
import { capitalize } from "@/utils/stringUtils";
import BaseTable from "@/components/BaseTable.vue";
import BaseSection from "@/components/BaseSection.vue";
import BaseButton from "@/components/BaseButton.vue";
// import api from "@/api/api";

interface ModelElement {
  // always has ID
  id: number,
  // also has any number of additional fields
  [key: string]: any
}

@Component({
  components: {BaseButton, BaseSection, BaseTable }
})
export default class ModelTable extends Vue {
  data: ModelElement[] = [];
  total: number = 0;
  columns: Object[] = [];
  modelName = capitalize(useRoute().params.modelName as string);
  selectedRows: number[] = [];
  selectAll: boolean = false;
  router: Router = useRouter();

  async getDataList() {
    try {
      // const res = await api.admin.list(this.modelName);
      // this.data = res.data;
      this.data = [
        {
          id: 1,
          name: "Roach",
          animal: "Horse",
          age: 8,
          color: "black",
          doctor: "Mr. Smith",
          owner: "Mr. Green",
        },
        {
          id: 2,
          name: "Jack",
          animal: "Dog",
          age: 8,
          color: "brown",
          doctor: "Mrs. Finch",
          owner: "Mr. Tyler",
        },
      ];
      this.total = this.data.length;
      this.columns = this.getColumnsFromData();
    } catch (e) {
      console.log(`Error getting list of ${this.modelName}:`, e);
    }
  }

  getColumnsFromData() {
    if (!this.data.length) {
      return [];
    }
    return Object.keys(this.data[0])
        .filter((fieldName) => fieldName !== "key")
        .map((fieldName) => ({
          title: capitalize(fieldName),
          field: fieldName,
          slot: fieldName,
        }));
  }

  toggleSelectAll(isChecked: boolean) {
    if (isChecked) {
      this.selectedRows.push(...this.data.map((item) => item.id));
      return;
    }
    this.selectedRows.splice(0);
  }

  toggleSelectRow(rowID: number, push = true) {
    if (push) {
      this.selectedRows.push(rowID);
      // if all elements pushed, check the selectAll checkbox
      if (this.selectedRows.length === this.data.length) {
        this.selectAll = true;
      }
    } else {
      const idx = this.selectedRows.indexOf(rowID);
      if (idx !== -1) {
        this.selectedRows.splice(idx, 1);
      }
      this.selectAll = false;
    }
  }

  createNewItem() {
    this.router.push({ name: "Create Model Item"});
  }

  created() {
    this.getDataList();
  }
}
</script>

<style lang="scss" scoped>
.table-layout {
  padding-top: 50px;
}
</style>