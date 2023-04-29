<template>
  <section class="content-section">
    <div :class="['content-inner', { 'content-inner-pad': withPadding }]">
      <div class="content-container">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component
export default class BaseSection extends Vue {
  @Prop({
    type: Boolean,
    default: true,
  })
  withPadding?: boolean;
}
</script>

<style lang="scss" scoped>
.content {
  &-section {
    width: 100%;
  }

  &-inner {
    max-width: 1354px;
    margin: 0 auto;
    padding: 0;

    &-pad {
      max-width: 1418px;
      padding: 32px;
    }
  }

  &-container {
    background: #fff;
    border-radius: 10px;
    padding: 32px 0;
  }
}

@media (max-width: 1200px) {
  .content-inner-pad {
    padding: 0 50px;
  }
}

@media (max-width: 650px) {
  .content-inner-pad {
    padding: 0 20px;
  }
}
</style>
