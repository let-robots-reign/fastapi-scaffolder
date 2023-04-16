<template>
  <a-layout class="main-layout table-layout">
    <base-section with-padding>
      <a-row type="flex" justify="center">
        <a-col :xs="20">
          <h1 class="heading">Элемент {{ modelName }} #{{ itemId }}</h1>
        </a-col>
        <a-col :xs="20">
          <a-form
            :model="itemData"
            name="form"
            layout="vertical"
            @finish="submit"
            @finishFailed="processError"
          >
            <a-form-item
              v-for="item in schema.fields"
              :key="item.model"
              :label="item.label"
              :rules="getItemRules(item)"
            >
              <component
                :is="`a-${item.type}`"
                :value="itemData[item.model]"
                :checked="!!itemData[item.model]"
                @change="(arg) => changeField(item, arg)"
                :placeholder="item.placeholder || ''"
                :disabled="item.disabled || false"
                :options="item.options?.map((op) => ({ value: op, label: op })) || []"
              >
                {{ itemData[item.model] }}
              </component>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </base-section>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import BaseSection from "@/components/BaseSection.vue";
import { capitalize } from "@/utils/stringUtils";

// TODO: types, multiple selection in a-select, create form component

@Component({
  components: {BaseSection}
})
export default class ModelItem extends Vue {
  modelName = capitalize(useRoute().params.modelName as string);
  itemId: number = parseInt(useRoute().params.id as string);
  itemData: any = {};
  schema: Object = {};

  async getItem() {
    try {
      // const itemRes = await api.admin.getOne(this.modelName, this.itemId);
      // this.itemData = itemRes.data;
      // const schemaRes = await api.admin.getModelSchema(this.modelName);
      // this.schema = schemaRes.data;
      this.itemData = {
        id: 1,
        name: "John Doe",
        skills: ["Javascript", "VueJS"],
        email: "john.doe@gmail.com",
        status: true
      };
      this.schema = {
        fields: [
          {
            type: "input",
            inputType: "string",
            label: "ID",
            model: "id",
            disabled: true
          },
          {
            type: "input",
            inputType: "string",
            label: "Name",
            model: "name",
            placeholder: "Fill in name",
            required: true
          },
          {
            type: "select",
            label: "Skills",
            model: "skills",
            options: ["Javascript", "VueJS", "CSS3", "HTML5"]
          },
          {
            type: "input",
            inputType: "email",
            label: "E-mail",
            model: "email",
            placeholder: "User's e-mail address"
          },
          {
            type: "checkbox",
            label: "Status",
            model: "status",
            default: true
          }
        ]
      };
    } catch (e) {
      console.log(e);
    }
  }

  getItemRules(item: any) {
    const rules: any = [
      {
        required: item.required || false,
        message: item.required || "",
      }
    ];
    if (item.type === "input") {
      rules.type = item.inputType;
    }
    return rules;
  }

  changeField(item: any, arg: any) {
    if (item.type === "checkbox") {
      this.itemData[item.model] = arg?.target?.checked;
      return;
    }
    this.itemData[item.model] = arg?.target?.value ?? arg;
  }

  submit() {
    console.log("Submit!");
  }

  processError() {
    console.log("Error!");
  }

  created() {
    this.getItem();
  }
}
</script>

<style lang="scss" scoped>

</style>