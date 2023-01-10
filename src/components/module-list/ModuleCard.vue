<script lang="ts">
import OmegaLink from '../ui/OmegaLink.vue';

export default {
  props: {
    name: String,
    url: String,
  },
  components: { OmegaLink },
};
</script>

<template>
  <OmegaLink :to="url">
    <div>{{ name }}</div>
  </OmegaLink>
</template>

<style></style>

