import { Directive } from 'vue';

export const clickOutside: Directive = {
  beforeMount: function (el, binding) {
    el.clickOutsideListener = (event: MouseEvent) => {
      if (el !== event.target && !el.contains(event.target)) {
        binding.value();
      }
    };

    // because click on router-link not stops propagation
    // and event fires off immediately
    setTimeout(() => {
      document.addEventListener('click', el.clickOutsideListener);
    }, 0);
  },
  unmounted: function (el) {
    document.removeEventListener('click', el.clickOutsideListener);
  },
};
