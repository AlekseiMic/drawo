<script lang="ts">
import { PropType } from 'vue';
import AppCard from './AppCard.vue';

export default {
  components: { AppCard },
  props: {
    apps: {
      type: Array as PropType<{ name: string; url: string }[]>,
      required: false,
      default() {
        return [];
      },
    },
  },
};
</script>

<template>
  <section class="list">
    <AppCard v-for="app in apps" :key="app.name" v-bind="app" />
  </section>
</template>

<style scoped>
.list {
  width: 1200px;
  margin: 0 auto 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  gap: 24px;
}
</style>
