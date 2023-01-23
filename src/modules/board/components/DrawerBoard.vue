<script lang="ts">
import { Observer } from 'src/plugins/drawer/Observer';
import { inject, reactive, ref } from 'vue';
import {
  Manager,
  LineTool,
  ToolPanel,
  LayerPanel,
  MoveTool,
  observerReducer,
  ObserverPanel,
  PenTool,
} from '../../../plugins/drawer/';
import { BoardService } from '../services/BoardService';
import { Storage } from '../services/Storage';

export default {
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
    const drawer = new Manager(userId.value);
    const toolPanel = reactive(new ToolPanel(drawer)) as ToolPanel;
    const layerPanel = reactive(new LayerPanel()) as LayerPanel;
    const observerPanel = reactive(new ObserverPanel()) as ObserverPanel;

    toolPanel.addTool(LineTool);
    toolPanel.addTool(MoveTool);
    toolPanel.addTool(PenTool);

    const currentObserver = observerPanel.create('test');
    observerPanel.create('test2');
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
    };
  },
  data() {
    return {
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
      }, 100);
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
  <div class="toolPanel">
    <button
      v-for="tool in toolPanel.tools"
      :key="tool"
      :class="{ active: toolPanel.active === tool }"
      @click="setTool(tool)"
    >
      {{ tool }}
    </button>
  </div>
  <div class="observerPanel">
    <button
      v-for="observer in observerPanel.observers"
      :key="observer.id"
      :class="{ active: observerPanel.active === observer }"
      @click="setObserver(observer)"
    >
      {{ observer.id }}
    </button>
  </div>
</template>

<style scoped lang="scss">
#board-container {
  position: relative;
  width: 100%;
}
.toolPanel {
  cursor: default;
  z-index: 100000;
  background: green;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);

  button {
    cursor: pointer;
    padding: 5px 10px;
  }
  button.active {
    background: red;
  }
}
.observerPanel {
  cursor: default;
  z-index: 100000;
  background: green;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);

  button {
    cursor: pointer;
    padding: 5px 10px;
  }
  button.active {
    background: red;
  }
}
</style>
