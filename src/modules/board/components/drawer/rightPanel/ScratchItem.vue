<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import TrashIcon from '@assets/svg/trash.svg?component';

export default {
  components: { IconButton, TrashIcon },
  props: {
    scratch: {
      type: String,
      required: true,
    },
  },
  emits: ['deleteScratch'],
};
</script>

<template>
  <div class="scratch">
    <div class="miniature"></div>
    <span class="name">Scratch</span>
    <IconButton class="delete-btn" @click="$emit('deleteScratch', scratch)">
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
  flex-grow: 1;
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
