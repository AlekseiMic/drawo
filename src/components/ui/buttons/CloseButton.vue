<script lang="ts">
import AlphaButton from './AlphaButton.vue';
export default {
  components: { AlphaButton },
  emits: ['close'],
};
</script>

<template>
  <AlphaButton class="close">
    <span class="close-icon" />
  </AlphaButton>
</template>

<style scoped>
.close {
  position: relative;
  background: none;
  padding: 0;
  width: 2rem;
  height: 2rem;
}
.close-icon {
  top: 0;
  left: 0;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
}

.close-icon::before,
.close-icon::after {
  position: absolute;
  display: block;
  background: var(--c-default-text-80);
  content: '';
  height: .3rem;
  width: 100%;
  top: 50%;
  left: 50%;
}
.close-icon::before {
  transform: translate(-50%, -50%) rotateZ(45deg);
}
.close-icon::after {
  transform: translate(-50%, -50%) rotateZ(-45deg);
}
</style>

