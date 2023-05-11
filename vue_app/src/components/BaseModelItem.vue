<script lang="ts">
import { ComponentBase, Vue } from "vue-facing-decorator";
import { type Router, useRoute, useRouter } from "vue-router";

@ComponentBase
export default class BaseModelItem extends Vue {
  itemId: number = parseInt(useRoute().params?.id as string);
  itemData: any = {};
  confirmModalOpened: boolean = false;
  router: Router = useRouter();

  get formMode() {
    return this.itemId ? "edit" : "create";
  }

  getOptions(options: string[] | number[]) {
    return options?.map((op) => ({ value: op, label: op })) || [];
  }

  cancelClicked() {
    this.router.back();
  }

  closeConfirmModal() {
    this.confirmModalOpened = false;
  }
}
</script>
