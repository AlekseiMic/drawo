<script lang="ts">
import ChevronIcon from '@assets/svg/chevron.svg?component';

export default {
  components: { ChevronIcon },
  data() {
    return { show: true };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
  },
};
</script>

<template>
  <section :class="{ show }">
    <header @click="toggle">
      <ChevronIcon :class="{ toggle: true, showed: show }" />
      <slot name="header">Section name</slot>
    </header>
    <slot v-if="show"></slot>
  </section>
</template>

<style scoped>
section {
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  min-height: 200px;
}
section:not(.show) {
  min-height: 32px;
  height: 32px;
}

header {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 10px 0 5px;
  height: 30px;
  background: #2f2f2f;
}

header .toggle {
  font-size: 1.6rem;
  margin-right: 5px;
}
header .toggle:not(.showed) {
  transform: rotateX(180deg);
}

header:hover {
  background: #555;
}
</style>
