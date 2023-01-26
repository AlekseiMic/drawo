<script lang="ts">
import { IScratch } from '../../../../plugins/drawer';
import { PropType } from 'vue';

export default {
  props: {
    scratch: {
      type: Object as PropType<IScratch>,
      required: true,
    },
  },
};
</script>

<template>
  <div class="scratch">
    <div class="miniature"></div>
    <span class="name">Scratch</span>
  </div>
</template>

<style scoped>
.scratch {
  height: 34px;
  background: #111;
  padding: 2px 2px;
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.miniature {
  background: #888;
  width: 32px;
  height: 32px;
}
</style>
