<script lang="ts">
import LineIcon from '@assets/svg/line.svg?component';
import MoveIcon from '@assets/svg/move.svg?component';
import PenIcon from '@assets/svg/pen.svg?component';
import EraserIcon from '@assets/svg/eraser2.svg?component';
import IconButton from '@ui/buttons/IconButton.vue';
import { PropType } from 'vue';
import { Manager } from '@plugins/drawer';

const icons: Record<string, string> = {
  LineTool: 'LineIcon',
  MoveTool: 'MoveIcon',
  PenTool: 'PenIcon',
  DeleteTool: 'EraserIcon',
};

export default {
  components: { LineIcon, MoveIcon, PenIcon, IconButton, EraserIcon },
  props: {
    board: {
      type: Object as PropType<Manager>,
      required: true,
    },
  },
  data() {
    return { icons };
  },
};
</script>

<template>
  <div class="panel" @mousedown.stop="" @touchstart.stop="" @touchend.stop="">
    <IconButton
      v-for="tool in board.tools.tools"
      :key="tool.constructor.name"
      :class="{ tool: true, active: board.tools.getActive() === tool }"
      @click.stop="board.tools.setActive(tool.constructor.name)"
    >
      <component :is="icons[tool.constructor.name]" />
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
