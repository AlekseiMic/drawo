<script lang="ts">
import { inject, reactive, ref } from 'vue';
import LineIcon from '../../../assets/svg/line.svg?component';
import MoveIcon from '../../../assets/svg/move.svg?component';
import PenIcon from '../../../assets/svg/pen.svg?component';
import GearIcon from '../../../assets/svg/gear.svg?component';
import {
  Manager,
  LineTool,
  ToolPanel,
  LayerPanel,
  Observer,
  MoveTool,
  observerReducer,
  ObserverPanel,
  PenTool,
} from '../../../plugins/drawer/';
import { BoardService } from '../services/BoardService';
import { Storage } from '../services/Storage';

const toolIcons = {
  LineTool: 'LineIcon',
  MoveTool: 'MoveIcon',
  PenTool: 'PenIcon',
};

export default {
  components: { Gear: GearIcon, LineIcon, MoveIcon, PenIcon },
  props: {
    room: {
      type: String,
      required: true,
    },
  },
  setup() {
    const boardService$ = inject('boardService') as BoardService;
    const storage$ = inject('storage') as Storage;
    const username = ref(storage$.name);
    const userId = ref(storage$.userId);
    const users = { [userId.value]: username.value };

    const drawer = new Manager(userId.value);
    const toolPanel = reactive(new ToolPanel(drawer)) as ToolPanel;
    const layerPanel = reactive(new LayerPanel()) as LayerPanel;
    const observerPanel = reactive(new ObserverPanel()) as ObserverPanel;

    toolPanel.addTool(LineTool);
    toolPanel.addTool(MoveTool);
    toolPanel.addTool(PenTool);

    const currentObserver = observerPanel.create(userId.value);
    observerPanel.active = currentObserver;

    drawer.addReducer(toolPanel.gerReducer());
    drawer.addReducer(observerReducer);

    drawer.toolPanel = toolPanel;
    drawer.layers = layerPanel;
    drawer.observers = observerPanel;

    return {
      drawer,
      toolPanel,
      layerPanel,
      observerPanel,
      boardService$,
      username,
      userId,
      users,
    };
  },
  data() {
    return {
      toolIcons,
      intervalHandle: null as null | ReturnType<typeof setInterval>,
    };
  },
  mounted() {
    if (
      this.$refs.boardContainer &&
      this.drawer.toolPanel &&
      this.drawer.layers
    ) {
      this.drawer.setContainer(this.$refs.boardContainer as HTMLDivElement);
      this.drawer.init();
      this.start();
    }
  },
  beforeUnmount() {
    this.stop();
  },
  methods: {
    start() {
      this.drawer.start();
      this.boardService$.joinRoom({ room: this.room, username: this.username });
      this.boardService$.subscribe((data) => {
        this.drawer.dispatch(data.actions, false);
      });
      this.intervalHandle = setInterval(() => {
        const actions = this.drawer.getActionHistory();
        if (actions.length === 0) return;
        this.drawer.clearActionHistory();
        const data = {
          actions,
          user: this.drawer.user,
        };
        this.boardService$.sendData(this.room, data);
      }, 10);
    },
    stop() {
      this.drawer.stop();
      if (this.intervalHandle) clearInterval(this.intervalHandle);
    },
    setTool(tool: string) {
      this.drawer.toolPanel.setActive(tool);
    },
    setObserver(observer: Observer) {
      this.drawer.setObserver(observer);
    },
  },
};
</script>

<template>
  <div id="board-container" ref="boardContainer"></div>
  <div class="right-panel">wow</div>
  <div class="toolPanel">
    <button
      v-for="tool in toolPanel.tools"
      :key="tool"
      :class="{ icon: true, tool: true, active: toolPanel.active === tool }"
      @click="setTool(tool)"
    >
      <component :is="(toolIcons as any)[tool]" />
    </button>
  </div>
  <Teleport to="#header-anchor">
    <div class="observerPanel">
      <button
        v-for="observer in observerPanel.observers"
        :key="observer.id"
        :title="users[observer.id]"
        :class="{
          icon: true,
          observer: true,
          active: observerPanel.active === observer,
        }"
        @click="setObserver(observer)"
      >
        <span>
          {{ users[observer.id] }}
        </span>
      </button>
    </div>
    <button class="icon settings-btn"><Gear /></button>
  </Teleport>
</template>

<style scoped lang="scss">
#board-container {
  position: relative;
  width: 100%;
}
.right-panel {
  padding: 10px;
  background: #222;
  width: 240px;
  box-shadow: -3px 0px 5px 0px var(--c-default-shadow);
}
.icon {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toolPanel {
  cursor: default;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 40px;
  padding: 4px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  column-gap: 5px;
}
.tool {
  svg {
    font-size: 2.2rem;
    max-width: 30px;
    max-height: 30px;
  }
  &.active {
    background: red;
  }
}
.observerPanel {
  height: 100%;
  margin-right: 20px;

  .observer {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    & span {
      display: block;
      max-width: 2ch;
      overflow: hidden;
    }
    &.active {
      box-shadow: inset 0 0 4px 2px cyan;
      background: red;
    }
  }
}
.settings-btn {
  svg {
    font-size: 3rem;
  }
}
</style>
