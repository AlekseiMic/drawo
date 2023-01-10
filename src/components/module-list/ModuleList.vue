<script lang="ts">
import { PropType } from 'vue';
import ModuleCard from './ModuleCard.vue';

export default {
  components: { ModuleCard },
  props: {
    modules: {
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
  <div class="list">
    <ModuleCard
      v-for="module in modules"
      :key="module.name"
      :name="module.name"
      :url="module.url"
    />
  </div>
</template>

<style scoped></style>

