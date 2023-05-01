<script lang="ts">
import { ComponentBase, Vue } from "vue-facing-decorator";
import { capitalize } from "@/utils/stringUtils";
import { type Router, useRouter } from "vue-router";

@ComponentBase
export default class BaseModelTable extends Vue {
  data: any[] = [];
  total: number = 0;
  columns: Object[] = [];
  selectedRows: number[] = [];
  selectAll: boolean = false;
  router: Router = useRouter();

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
}
</script>
