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

<script setup>
import { computed, ref } from "vue";

import vClickOutside from "@/directives/clickOutside";

import ArrowIcon from "@/components/icons/ArrowIcon.vue";

const props = defineProps({
  modelValue: {
    type: String,
  },
  // format of options: [{label: "", value: ...}]
  // if Array of primitives is passed, it is converted
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change", "update:model-value"]);

const showDropdown = ref(false);
const toggleDropdown = () => (showDropdown.value = !showDropdown.value);
const formattedOptions = computed(() => {
  if (props.options?.length && typeof props.options[0] === "object") {
    return props.options;
  }
  return props.options.map((op) => ({ label: op, value: op }));
});
const chosenOption = computed(() => formattedOptions.value.find((op) => op.value === props.modelValue));
const selectOption = (option) => {
  emit("change", option.value);
  emit("update:model-value", option.value);
  showDropdown.value = false;
};
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