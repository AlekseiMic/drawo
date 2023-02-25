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
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['delete-layer', 'selectLayer'],
};
</script>

<template>
  <button
    :tabindex="active ? -1 : 0"
    :class="{ layer: true, active }"
    @click="$emit('selectLayer', layer!.id)"
  >
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
  background: var(--c-default-background-120);
  height: 40px;
  display: flex;
  width: 100%;
  align-items: center;
  column-gap: 10px;
  padding-right: 10px;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  color: var(--c-default-text);

  &:focus,
  &:hover {
    background: var(--c-default-background-140);
  }
}

.layer.active {
  background: var(--c-default-background-80);
}
.layer.active:focus {
  background: var(--c-default-background-80);
}
.layer .name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-grow: 1;
  padding: 0 15px;
  text-align: left;
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
