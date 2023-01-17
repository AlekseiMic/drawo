<script lang="ts">
import { Observer } from 'src/plugins/drawer/Observer';
import { reactive } from 'vue';
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

export default {
  setup() {
    const drawer = new Manager('test');
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

    return { drawer, toolPanel, layerPanel, observerPanel };
  },
  mounted() {
    if (
      this.$refs.boardContainer &&
      this.drawer.toolPanel &&
      this.drawer.layers
    ) {
      this.drawer.setContainer(this.$refs.boardContainer as HTMLDivElement);
      this.drawer.init();
      this.drawer.start();
    }
  },
  methods: {
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
