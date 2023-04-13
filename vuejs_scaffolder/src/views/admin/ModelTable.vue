<template>
  <div>Table</div>
  <div>{{ data }}</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component
export default class ModelTable extends Vue {
  data: any[] = [];
}
</script>

<style lang="scss" scoped>

</style>