<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="modal-backdrop" @click="$emit('close')">
        <div class="modal" @click.stop>
          <header class="modal-header">
            <slot v-if="$slots.header" name="header" />
            <span class="btn-close" @click="$emit('close')"> x </span>
          </header>
          <section class="modal-body">
            <slot />
          </section>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits: ["close"],
})
export default class BaseModal extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;
}
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2d2d2d80;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal {
  position: relative;
  padding: 37px 40px 43px 40px;
  background: #fff;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-width: 50%;
  border-radius: 9px;
}

.modal-header,
.modal-footer {
  display: flex;
}

.modal-header {
  justify-content: space-between;
  margin-bottom: 30px;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
}

.btn-close {
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #2d2d2d;
  background: transparent;
}

@media (max-width: 1440px) {
  .modal {
    min-width: 60%;
  }
}
</style>
