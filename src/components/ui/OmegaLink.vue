<script lang="ts">
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <router-link :to="to"><slot></slot></router-link>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
