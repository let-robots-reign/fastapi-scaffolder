<template>
  <a-layout class="main-layout table-layout">
    <base-section with-padding>
      <a-row type="flex" justify="center">
        <a-col :xs="20">
          <div v-if="formMode !== 'create'" class="heading-box">
            <h1 class="heading" >
              Элемент {{ modelName }} #{{ itemId }}
            </h1>
            <base-button
              class="button"
              size="large"
              danger
              @click="deleteItem"
            >
              Удалить элемент
            </base-button>
          </div>
          <h1 class="heading" v-else>Создание элемента {{ modelName }}</h1>
        </a-col>
        <a-col :xs="20">
          <a-form
            :model="itemData"
            name="form"
            ref="form"
            layout="vertical"
          >
            <template
              v-for="item in schema.fields"
              :key="item.model"
            >
              <a-form-item
                v-if="!(formMode === 'create' && item.disabled)"
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
            </template>
          </a-form>
        </a-col>
        <a-col :xs="20">
          <base-button class="button" size="large" @click="submit">Сохранить</base-button>
          <base-button class="button" type="secondary" size="large" @click="cancelClicked">Отменить</base-button>
        </a-col>
      </a-row>
    </base-section>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { type Router, useRoute, useRouter} from "vue-router";
import BaseSection from "@/components/BaseSection.vue";
import { capitalize } from "@/utils/stringUtils";
import BaseButton from "@/components/BaseButton.vue";

// TODO: types, multiple selection in a-select, create form component

@Component({
  components: { BaseButton, BaseSection}
})
export default class ModelItem extends Vue {
  modelName = capitalize(useRoute().params.modelName as string);
  itemId: number = parseInt(useRoute().params?.id as string);
  itemData: any = {};
  schema: Object = {};
  router: Router = useRouter();

  get formMode() {
    return this.itemId ? "edit" : "create";
  }

  async getItem() {
    try {
      // const itemRes = await api.admin.getOne(this.modelName, this.itemId);
      // this.itemData = itemRes.data;
      this.itemData = {
        id: 1,
        name: "John Doe",
        skills: ["Javascript", "VueJS"],
        email: "john.doe@gmail.com",
        status: true
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getModelSchema() {
    try {
      // const schemaRes = await api.admin.getModelSchema(this.modelName);
      // this.schema = schemaRes.data;
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

  cancelClicked() {
    this.router.back();
  }

  submit() {
    console.log("Submit!");
  }

  deleteItem() {
    console.log("Delete item!");
  }

  processError() {
    console.log("Error!");
  }

  async created() {
    await this.getModelSchema();
    if (this.formMode !== "create") {
      await this.getItem();
    }
  }
}
</script>

<style lang="scss" scoped>
.heading-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  margin-right: 20px;
}
</style>