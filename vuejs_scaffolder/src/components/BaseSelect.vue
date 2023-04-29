<template>
  <div
    v-click-outside="() => (showDropdown = false)"
    class="base-select"
    @click="toggleDropdown"
  >
    <span
      v-if="!chosenOption"
      class="base-select__placeholder"
    >
      {{ placeholder }}
    </span>
    <span
      v-else
      class="base-select__selected-option"
    >
      <slot
        name="chosen-option"
        :option="chosenOption"
      >
        {{ chosenOption.label }}
      </slot>
    </span>
    <arrow-icon
      class="base-select__arrow"
      color="#005aff"
      :orientation="showDropdown ? 'down' : 'up'"
    />
    <transition name="slide">
      <div
        v-show="showDropdown"
        class="base-select__dropdown-container"
      >
        <div
          v-for="option in formattedOptions"
          :key="option.value"
          :class="[
            'base-select__dropdown-option', 
            { 'base-select__dropdown-option_selected': option.value === chosenOption.value }
          ]"
          @click.stop="selectOption(option)"
        >
          <span
            :class="[
              'base-select__option-text',
              { 'base-select__option-text_selected': option.value === modelValue }
            ]"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import vClickOutside from "@/directives/clickOutside";

type Option = {
  label: string,
  value: string | number,
}

@Component({
  components: { ArrowIcon },
  emits: ["change", "update:model-value"],
  directives: { clickOutside: vClickOutside },
})
export default class BaseSelect extends Vue {
  @Prop({
    type: String
  })
  modelValue?: string;

  // format of options: [{label: "", value: ...}]
  // if Array of primitives is passed, it is converted
  @Prop({
    type: Array,
    default: () => []
  })
  options?: Option[] | string[] | number[];

  @Prop({
    type: String,
    default: "",
  })
  placeholder?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  disabled?: boolean;

  showDropdown = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  get formattedOptions() {
    if (this.options?.length && this.options[0] instanceof Option) {
      return this.options as Option[];
    }
    return this.options!.map((op) => ({ label: op, value: op }));
  }
  get chosenOption() {
    return this.formattedOptions.find((op) => op.value === this.modelValue);
  }
  selectOption(option: Option) {
    this.$emit("change", option.value);
    this.$emit("update:model-value", option.value);
    this.showDropdown = false;
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  width: fit-content;
  min-width: 100px;
  padding: 7px 15px;
  position: relative;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(45, 45, 45, 0.03);
  border: 1px solid rgba(45, 45, 45, 0.3);
  border-radius: 10px;
  font-size: 14px;
  line-height: 21px;
  cursor: pointer;

  &__selected-option {
    margin-right: 8px;
  }

  &__dropdown-container {
    position: absolute;
    padding: 14px 20px;
    background-color: #fff;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateY(calc(-35px - 7px));
    box-shadow: 0 22.3363px 17.869px rgba(0, 0, 0, 0.0671),
      0 6.6501px 5.32008px rgba(0, 0, 0, 0.0928953),
      0 2.76726px 2.21381px rgba(0, 0, 0, 0.0646635);
    border-radius: 10px;
  }

  &__dropdown-option {
    cursor: pointer;

    &:not(:last-of-type) {
      margin-bottom: 8px;
    }
  }

  &__option-text {
    &_selected {
      font-weight: 500;
    }
  }
}
</style>