<template>
  <div class="pagination">
    <base-select
      :model-value="pageSize"
      class="pagination__select"
      :options="pageSizeOptions"
      @update:model-value="changePageSize"
    >
      <template #chosen-option="{ option }">
        по {{ option.label }}
      </template>
    </base-select>
    <div v-if="pagesCount" class="pages-container">
      <arrow-icon
        class="pagination__arrow"
        orientation="left"
        :color="currentPage === 1 ? '#2d2d2d4d' : '#005aff'"
        @click="pageClicked(Math.max(1, currentPage - 1))"
      />
      <div class="pages-container__pages">
        <span
          v-for="pageNumber in pagesElements"
          :key="pageNumber"
          :class="[
            'pages-container__page',
            { 'pages-container__page_current': pageNumber === currentPage,
              'pages-container__page_inactive': pageNumber === '...' }
          ]"
          @click="pageClicked(pageNumber)"
        >
          {{ pageNumber }}
        </span>
      </div>
      <arrow-icon
        class="pagination__arrow"
        orientation="right"
        :color="!pagesCount || currentPage === pagesCount ? '#2d2d2d4d' : '#005aff'"
        @click="pageClicked(Math.min(pagesCount, currentPage + 1))"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-facing-decorator";
import BaseSelect from "@/components/BaseSelect.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import consts from "@/utils/consts";

@Component({
  components: { BaseSelect, ArrowIcon },
  emits: ["change-page", "change-page-size"],
})
export default class Pagination extends Vue {
  @Prop({
    type: Number,
    default: 1,
  })
  pagesCount!: number;
  
  @Prop({
    type: Number,
    default: consts.DEFAULT_PAGE_SIZE,
  })
  defaultPageSize!: number;

  @Prop({
    type: Array,
    default: consts.DEFAULT_PAGE_SIZE_OPTIONS,
  })
  pageSizeOptions!: number[];
  
  currentPage = 1;
  pageSize = (this.defaultPageSize || consts.DEFAULT_PAGE_SIZE).toString();
  
  get pagesElements() {
    let pages = Array.from(Array(this.pagesCount), (e, i) => ++i);
    if (this.pagesCount > 5) {
      // 1 ... 8 9 10
      if (this.currentPage > this.pagesCount - 3) {
        return [1, "...", ...pages.slice(pages.length - 3, pages.length)];
      }
      // 1 ... N ... 10
      if (this.currentPage > 3) {
        return [1, "...", this.currentPage, "...", this.pagesCount];
      }
      // 1 2 3 ... 10
      return [...pages.slice(0, 3), "...", this.pagesCount];
    }
    return pages;
  }

  pageClicked(page: number | "...") {
    if (page === "..." || page === this.currentPage || !this.pagesCount) {
      return;
    }
    this.currentPage = page;
    this.$emit("change-page", page);
  }

  changePageSize(size: string) {
    if (this.pageSize !== size) {
      // different page clicked
      this.$emit("change-page-size", size);
    }
    this.pageSize = size;
  };

  @Watch("pagesCount")
  watchPagesCount(newCount: number) {
    this.pageClicked(Math.min(this.currentPage, newCount));
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  display: flex;
  text-align: right;

  &__select {
    margin-left: auto;
    margin-right: 18px;
  }

  &__arrow {
    cursor: pointer;
  }
}

.pages-container {
  display: flex;
  align-items: center;
  user-select: none;

  &__pages {
    margin: 0 9px;
  }

  &__page {
    color: rgba(45, 45, 45, 0.3);
    cursor: pointer;

    &_current {
      color: #005aff;
    }
    
    &_inactive {
      cursor: default;
    }

    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }
}
</style>