<script lang="ts">
import LineIcon from '@assets/svg/line.svg?component';
import MoveIcon from '@assets/svg/move.svg?component';
import PenIcon from '@assets/svg/pen.svg?component';
import IconButton from '@ui/buttons/IconButton.vue';
import { PropType } from 'vue';

const toolIcons: Record<string, string> = {
  LineTool: 'LineIcon',
  MoveTool: 'MoveIcon',
  PenTool: 'PenIcon',
};

export default {
  components: { LineIcon, MoveIcon, PenIcon, IconButton },
  props: {
    tools: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    active: {
      type: String,
      default: () => '',
    },
  },
  emits: ['changeTool'],
  data() {
    return { toolIcons };
  },
};
</script>

<template>
  <div class="panel" @mouseup.stop="" @mousedown.stop="">
    <IconButton
      v-for="tool in tools"
      :key="tool"
      :class="{ tool: true, active: active === tool }"
      @click.stop="$emit('changeTool', tool)"
    >
      <component :is="toolIcons[tool]" />
    </IconButton>
  </div>
</template>

<style scoped lang="scss">
.panel {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 40px;
  padding: 4px;
  display: flex;
  column-gap: 5px;
}
.tool {
  svg {
    font-size: 2.4rem;
  }
  &.active {
    background: red;
  }
}
</style>
