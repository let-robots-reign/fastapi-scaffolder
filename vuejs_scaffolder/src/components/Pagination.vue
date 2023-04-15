<template>
  <div class="pagination">
    <base-select
      :model-value="pageSize"
      class="pagination__select"
      :options="consts.FUNDS_PAGE_SIZE_OPTIONS"
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

<script setup>
import { computed, ref, watch } from "vue";

import BaseSelect from "@/components/BaseSelect.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import consts from "@/utils/consts";

const props = defineProps({
  pagesCount: {
    type: Number,
    default: 1,
  },
  defaultPageSize: {
    type: Number,
    default: consts.DEFAULT_PAGE_SIZE,
  },
});

const emit = defineEmits(["change-page", "change-page-size"]);

const currentPage = ref(1);
const pageSize = ref(props.defaultPageSize.toString());
const pagesElements = computed(() => {
  let pages = Array.from(Array(props.pagesCount), (e, i) => ++i);
  if (props.pagesCount > 5) {
    // 1 ... 8 9 10
    if (currentPage.value > props.pagesCount - 3) {
      return [1, "...", ...pages.slice(pages.length - 3, pages.length)];
    }
    // 1 ... N ... 10
    if (currentPage.value > 3) {
      return [1, "...", currentPage.value, "...", props.pagesCount];
    }
    // 1 2 3 ... 10
    return [...pages.slice(0, 3), "...", props.pagesCount];
  }
  return pages;
});
const pageClicked = (page) => {
  if (page === "..." || page === currentPage.value || !props.pagesCount) {
    return;
  }
  currentPage.value = page;
  emit("change-page", page);
};

const changePageSize = (size) => {
  if (pageSize.value !== size) {
    // different page clicked
    emit("change-page-size", size);
  }
  pageSize.value = size;
};

// watch pages count in case max page is scss than current page (after pageSize was changed)
watch(() => props.pagesCount, (newCount) => pageClicked(Math.min(currentPage.value, newCount)));
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