<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import TrashIcon from '@assets/svg/trash.svg?component';
import { PropType } from 'vue';

export default {
  components: { IconButton, TrashIcon },
  props: {
    layer: {
      type: Object as PropType<{
        id: string;
        removable: boolean;
      }>,
      required: true,
    },
    active: Boolean,
    index: Number,
  },
  emits: ['delete-layer', 'selectLayer'],
};
</script>

<template>
  <button
    :class="{ layer: true, active }"
    @click="$emit('selectLayer', layer!.id)"
  >
    <div class="miniature" />
    <div class="name">Layer {{ index }}</div>
    <IconButton
      v-if="layer.removable"
      class="delete-btn"
      @click="$emit('delete-layer', layer!.id)"
    >
      <TrashIcon />
    </IconButton>
  </button>
</template>

<style scoped lang="scss">
.layer {
  background: #202020;
  height: 40px;
  display: flex;
  width: 100%;
  align-items: center;
  column-gap: 10px;
  padding-right: 10px;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  &:focus,
  &:hover {
    background: #171717;
  }
}

.layer.active {
  background: #333;
}

.layer .miniature {
  width: 40px;
  height: 40px;
  background: #888;
  border: 0;
  box-shadow: 0;
  flex-shrink: 0;
}
.layer .name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.layer .delete-btn {
  width: 24px;
  height: 24px;
  padding: 4px;
  flex-shrink: 0;

  &:focus,
  &:hover {
    background: red;
  }
}
.delete-btn svg {
  font-size: 2.8rem;
}
</style>
