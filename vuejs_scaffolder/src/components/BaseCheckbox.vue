<template>
  <label :class="['wrapper', { 'wrapper_no-label': !label }]">
    <input
      class="checkbox"
      type="checkbox"
      :value="value"
      :checked="isChecked"
      @change="updateInput"
    >
    <span class="label">{{ label }}</span>
    <span class="checkmark" />
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [Array, Boolean],
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  emits: ["change", 'update:model-value'],
  computed: {
    isChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value);
      }
      return this.modelValue;
    }
  },
  methods: {
    updateInput(event) {
      let isChecked = event.target.checked;
      if (this.modelValue instanceof Array) {
        let newValue = [...this.modelValue];
        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }
        this.$emit("change", newValue);
        this.$emit("update:model-value", newValue);
      } else {
        this.$emit("change", isChecked);
        this.$emit("update:model-value", isChecked);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  height: fit-content;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;

  &_no-label {
    padding-left: 8px;
  }
}

/* hide the browser's default checkbox */
.wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 1px solid rgba(45, 45, 45, 0.3);
  border-radius: 2px;
}

.label {
  width: max-content;
  font-size: 14px;
  line-height: 20px;
  min-height: 19px;
}

/* on mouse-over, add a grey background color */
.wrapper:hover input ~ .checkmark {
  background-color: rgba(45, 45, 45, 0.05);
}

/* when the checkbox is checked, add a blue background */
.wrapper input:checked ~ .checkmark {
  background-color: #005aff;
}

/* create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* show the checkmark when checked */
.wrapper input:checked ~ .checkmark:after {
  display: block;
}

/* style the checkmark/indicator */
.wrapper .checkmark:after {
  left: 6px;
  top: 1px;
  width: 7px;
  height: 12px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>