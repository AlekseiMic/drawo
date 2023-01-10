<script lang="ts">
import ModuleList from '../components/module-list/ModuleList.vue';
export default {
  components: { ModuleList },
  data: function () {
    return {
      modules: [{ name: 'test', url: '/board' }],
    };
  },
};
</script>

<template>
  <ModuleList :modules="modules" />
</template>

<style></style>
