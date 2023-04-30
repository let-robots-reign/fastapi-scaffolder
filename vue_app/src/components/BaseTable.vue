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

<script lang="ts">
import { useSlots } from "vue";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseSpinner from "@/components/BaseSpinner.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import Pagination from "@/components/Pagination.vue";
import consts from "@/utils/consts";

type Column = {
  title: string,
  field: string,
  slot: string,
};

@Component({
  components: { BaseCheckbox, BaseSpinner, ArrowIcon, Pagination },
  emits: ["row-checked-change", "table-changed"],
})
export default class BaseTable extends Vue {
  @Prop({
    required: true,
    type: Array,
  })
  columns!: Column[];

  @Prop({
    type: Array,
    default: () => [],
  })
  data?: any[];

  @Prop({
    type: Number,
    default: 0,
  })
  total?: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  withPagination?: boolean;

  @Prop({
    type: Number,
    default: consts.DEFAULT_PAGE_SIZE,
  })
  defaultPageSize?: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  loading?: boolean;

  @Prop({
    type: Array,
    default: undefined,
  })
  selectedRows?: number[] | undefined;

  @Prop({
    type: String,
    default: "id",
  })
  rowIdField?: string;

  slots = useSlots();
  sorterDirs = ["asc", "desc", ""];
  currentSorter = {
    field: "",
    direction: "",
  };
  tableParams = {
    sort: this.currentSorter,
    pagination: {
      currentPage: 1,
      pageSize: this.defaultPageSize,
    },
  };

  get pagesCount() {
    const pageSize = this.tableParams.pagination?.pageSize;
    if (!pageSize || !this.total || !this.tableParams.pagination.pageSize) {
      return 1;
    }
    return Math.ceil(this.total / this.tableParams.pagination.pageSize);
  }

  get rowSelection() {
    return Array.isArray(this.selectedRows);
  }

  get selectedRowsSet() {
    return new Set(this.selectedRows ?? []);
  }

  hasSlot(column: Column) {
    return column.slot && Object.keys(this.slots).includes(column.slot);
  }

  toggleSorter(column: Column) {
    if (column.field !== this.currentSorter.field) {
      // different field was chosen, first sort is in ascending order
      this.currentSorter.direction = "asc";
    } else {
      this.currentSorter.direction =
        this.sorterDirs[
          (this.sorterDirs.indexOf(this.currentSorter.direction) + 1) % this.sorterDirs.length
        ];
    }
    this.currentSorter.field = column.field;
    // tableParams.sort = `${currentSorter.field}:${currentSorter.direction}`;
  }

  @Watch("tableParams")
  watchTableParams(newParams: typeof this.tableParams) {
    this.$emit("table-changed", newParams);
  }
}
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
