import type { DirectiveBinding } from "vue";

interface HTMLExElement extends HTMLElement {
  clickOutsideEvent: (event: Event) => void;
}

export default {
  beforeMount(el: HTMLExElement, binding: DirectiveBinding<() => void>) {
    const clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value?.();
      }
    }
    document.body.addEventListener('click', clickOutsideEvent);
    el.clickOutsideEvent = clickOutsideEvent;
  },

  unmounted(el: HTMLExElement) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
}
