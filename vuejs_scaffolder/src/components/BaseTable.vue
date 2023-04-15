<template>
  <div class="base-table-container">
    <div class="base-table-wrapper">
      <table class="base-table">
        <thead>
          <tr class="base-table__row base-table__row_head">
            <td v-if="rowSelection" />
            <template v-for="column in columns" :key="column.title">
              <td class="base-table__head-col">
                <div
                  class="base-table__head-col-content"
                  :class="{
                    'base-table__head-col_sortable': column.sorter !== false,
                  }"
                  @click="column.sorter !== false && toggleSorter(column)"
                >
                  <span>{{ column.title }}</span>
                  <div
                    v-if="currentSorter.field === column.field"
                    class="base-table__sorters"
                  >
                    <arrow-icon
                      class="base-table__sorter-arrow"
                      :color="
                        currentSorter.direction === 'asc'
                          ? '#005aff'
                          : '#2d2d2d4d'
                      "
                    />
                    <arrow-icon
                      class="base-table__sorter-arrow"
                      orientation="down"
                      :color="
                        currentSorter.direction === 'desc'
                          ? '#005aff'
                          : '#2d2d2d4d'
                      "
                    />
                  </div>
                </div>
              </td>
            </template>
          </tr>
        </thead>
        <tbody class="base-table__tbody">
          <base-spinner v-if="loading" class="base-table__spinner" />
          <tr
            v-for="row in data"
            v-else
            :key="row[rowIdField]"
            class="base-table__row"
          >
            <td v-if="rowSelection">
              <base-checkbox
                :model-value="selectedRowsSet.has(row[rowIdField])"
                @change="
                  (isChecked) =>
                    $emit('row-checked-change', row[rowIdField], isChecked)
                "
              />
            </td>
            <td
              v-for="column in columns"
              :key="`${row[rowIdField]}-${column.title}`"
            >
              <slot v-if="hasSlot(column)" :name="column.slot" :item="row" />
              <span v-else>{{ row[column.field] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination
      :default-page-size="defaultPageSize"
      :pages-count="pagesCount"
      @change-page="(page) => (tableParams.pagination.currentPage = page)"
      @change-page-size="(size) => (tableParams.pagination.pageSize = size)"
    />
  </div>
</template>

<script setup>
import { computed, reactive, useSlots, watch } from "vue";

import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseSpinner from "@/components/BaseSpinner.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import Pagination from "@/components/Pagination.vue";
import consts from "@/utils/consts";

const props = defineProps({
  columns: {
    required: true,
    type: Array,
  },
  data: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  withPagination: {
    type: Boolean,
    default: true,
  },
  defaultPageSize: {
    type: Number,
    default: consts.DEFAULT_PAGE_SIZE,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedRows: {
    type: Array,
    default: undefined,
  },
  rowIdField: {
    type: String,
    default: "id",
  },
});

const emit = defineEmits(["row-checked-change", "table-changed"]);

// convert to set to faster checks
const rowSelection = computed(() => Array.isArray(props.selectedRows));
const selectedRowsSet = computed(() => new Set(props.selectedRows ?? []));

const hasSlot = (column) => {
  return column.slot && Object.keys(useSlots()).includes(column.slot);
};

const sorterDirs = ["asc", "desc", ""];
const currentSorter = reactive({
  field: "",
  direction: "",
});
const tableParams = reactive({
  sort: currentSorter,
  pagination: {
    currentPage: 1,
    pageSize: props.defaultPageSize,
  },
});
const pagesCount = computed(() => {
  const pageSize = tableParams.pagination?.pageSize;
  if (!pageSize) {
    return 1;
  }
  return Math.ceil(props.total / tableParams.pagination.pageSize);
});

const toggleSorter = (column) => {
  if (column.field !== currentSorter.field) {
    // different field was chosen, first sort is in ascending order
    currentSorter.direction = "asc";
  } else {
    currentSorter.direction =
      sorterDirs[
        (sorterDirs.indexOf(currentSorter.direction) + 1) % sorterDirs.length
      ];
  }
  currentSorter.field = column.field;
  // tableParams.sort = `${currentSorter.field}:${currentSorter.direction}`;
};

watch(tableParams, (newParams) => emit("table-changed", newParams));
</script>

<style lang="scss" scoped>
.base-table-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.base-table-wrapper {
  // scroll table horizontally
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 32px;
  min-height: 200px;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 17px;

  &__head-col {
    color: rgba(45, 45, 45, 0.5);

    &:hover {
      background-color: #f2f2f2;
    }
  }

  &__head-col-content {
    display: flex;
    align-items: center;
  }

  &__head-col_sortable {
    cursor: pointer;
  }

  &__sorters {
    display: flex;
    margin-left: 7px;
    cursor: pointer;
    user-select: none;
  }

  &__sorter-arrow {
    &:first-of-type {
      margin-right: 2px;
    }
  }

  &__tbody {
    position: relative;
  }

  &__spinner {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
  }

  &__row {
    height: 45px;

    &:not(&_head) {
      border-bottom: 1px solid rgba(45, 45, 45, 0.15);

      &:hover {
        background-color: #e6f3ff;
      }
    }
  }

  td {
    padding-left: 8px;
  }
}
</style>
