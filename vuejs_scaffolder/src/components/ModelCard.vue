<template>
  <div class="entity-card" @click="$emit('click')">
    <h2 class="entity-card__name">{{ name }}</h2>
    <arrow-right-outlined class="entity-card__arrow" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-facing-decorator";
import { ArrowRightOutlined } from "@ant-design/icons-vue";

@Component({
  components: { ArrowRightOutlined }
})
export default class ModelCard extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  name!: string

  @Emit("click")
  private click(): void {}
}
</script>

<style lang="scss" scoped>
.entity-card {
  width: 100%;
  height: 100px;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 16px;
  cursor: pointer;
  margin-bottom: 32px;

  &__name {
    font-size: 32px;
    line-height: 35px;
    color: #2d2d2d;
    font-weight: 700;
    margin: 0;
  }

  &__arrow {
    font-size: 26px;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  &:hover {
    box-shadow: 0 3px 2px 1px rgba(0, 0, 0, 0.07);
  }

  &:hover > &__arrow {
    opacity: 1;
  }
}
</style>