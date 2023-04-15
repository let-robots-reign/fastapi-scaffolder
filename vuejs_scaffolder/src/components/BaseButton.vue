<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :class="getButtonClasses"
    :style="cssVars"
    @click="(event) => !disabled && $emit('click', event)"
  >
    <slot></slot>
  </a>
  <button
    v-else
    :class="getButtonClasses"
    :style="cssVars"
    @click="(event) => !disabled && $emit('click', event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    type: {
      type: String,
      default: "primary",
      validator: (type) => ["primary", "secondary"].includes(type),
    },
    size: {
      type: String,
      default: "default",
      validator: (type) => ["large", "default"].includes(type),
    },
    href: {
      type: String,
    },
    target: {
      type: String,
    },
    widthAuto: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
    },
    fontWeight: {
      type: String,
    },
    height: {
      type: String,
    },
    borderRadius: {
      type: String,
    },
  },
  emits: ["click"],
  computed: {
    cssVars() {
      return {
        "--font-size":
          this.fontSize || (this.size === "large" ? "12px" : "10px"),
        "--font-weight":
          this.fontWeight || (this.size === "large" ? "600" : "500"),
        "--height": this.height || (this.size === "large" ? "35px" : "30px"),
        "--border-radius":
          this.borderRadius || (this.size === "large" ? "10px" : "6px"),
      };
    },
    getButtonClasses() {
      return [
        "button",
        `button_${this.type}`,
        `button_${this.size}`,
        {
          button_disabled: this.disabled,
          "button_width-auto": this.widthAuto,
          "button_full-width": this.fullWidth,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  min-width: 110px;
  height: var(--height);
  padding: 0 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #eaeaea;
  border-radius: var(--border-radius);
  border: none;
  color: #2d2d2d;
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  font-family: inherit;

  &_large {
    padding: 0 20px;
    min-width: 160px;
    text-transform: uppercase;
  }

  &:hover {
    cursor: pointer;
    background-color: #cacaca;
  }

  &_disabled {
    color: rgba(45, 45, 45, 0.4);
    background: #dbdbdb;

    &:hover {
      cursor: default;
      background: #dbdbdb;
    }
  }

  &_primary {
    background-color: #005aff;
    color: #fff;

    &:hover {
      cursor: pointer;
      background-color: #0041d7;
    }
  }

  &_primary&_disabled {
    color: rgba(255, 255, 255, 0.5);
    background: #acbedf;

    &:hover {
      cursor: default;
    }
  }

  &_width-auto {
    min-width: auto;
  }

  &_full-width {
    width: 100%;
    text-align: center;
  }
}
</style>
