<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import TrashIcon from '@assets/svg/trash.svg?component';
import { PropType } from 'vue';
import { IScratch } from '@plugins/drawer';

export default {
  components: { IconButton, TrashIcon },
  props: {
    scratch: {
      type: Object as PropType<IScratch>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['deleteScratch'],
};
</script>

<template>
  <div class="scratch">
    <div class="miniature"></div>
    <div class="name__wrapper">
      <span class="index">[{{ index }}]</span>
      <span class="name">{{
        scratch.constructor.name.split('Scratch')[0]
      }}</span>
    </div>
    <IconButton class="delete-btn" @click="$emit('deleteScratch', scratch.id)">
      <TrashIcon />
    </IconButton>
  </div>
</template>

<style scoped>
.scratch {
  height: 34px;
  background: #202020;
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding-right: 10px;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.5);
  position: relative;
}
.index {
  font-size: 9px;
  line-height: 8px;
}
.name__wrapper {
  margin-top: -4px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.miniature {
  width: 34px;
  height: 34px;
  background: #888;
  border: 0;
  box-shadow: 0;
  flex-shrink: 0;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.delete-btn {
  width: 24px;
  height: 24px;
  padding: 4px;
  flex-shrink: 0;
}

.delete-btn svg {
  font-size: 2.8rem;
}
</style>
