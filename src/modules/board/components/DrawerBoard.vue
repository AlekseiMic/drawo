<script lang="ts">
import { inject, PropType, reactive, shallowReactive } from 'vue';
import {
  Manager,
  LineTool,
  LayerManager,
  User,
  MoveTool,
  observerReducer,
  UserManager,
  PenTool,
  Action,
  DeleteTool,
  toolReducer,
  removeScratch,
  createLayer,
  removeLayer,
  layerReducer,
  addObserver,
} from '../../../plugins/drawer/';
import { BoardService } from '../services/BoardService';
import ToolBar from './drawer/ToolBar.vue';
import SettingsButton from './drawer/SettingsButton.vue';
import ObserverBar from './drawer/ObserverBar.vue';
import RightPanel from './drawer/rightPanel/RightPanel.vue';
import QuitButton from './QuitButton.vue';
import { nanoid } from 'nanoid';

export default {
  components: { ToolBar, SettingsButton, ObserverBar, RightPanel, QuitButton },
  props: {
    room: { type: String, required: true },
    user: {
      type: Object as PropType<{ id: string; name: string }>,
      required: true,
    },
  },
  emits: ['quitRoom'],
  setup(props) {
    const board = new Manager(props.user);
    board.tools = shallowReactive(board.tools);
    board.layers = reactive(board.layers) as LayerManager;
    board.users = reactive(board.users) as UserManager;

    board.tools.add(LineTool, MoveTool, PenTool, DeleteTool);
    board.actions.addReducer(toolReducer, observerReducer, layerReducer);

    return {
      boardService$: inject('boardService') as BoardService,
      intervalHandle: null as null | ReturnType<typeof setInterval>,
      board,
      toolPanel: board.tools,
      layerPanel: board.layers,
      observerPanel: board.users,
    };
  },
  computed: {
    layers() {
      const hiddenLayers = ['preview'];
      const lockedLayers = ['main'];
      return this.layerPanel?.order.reduce(
        (acc: { id: string; removable: boolean }[], id) => {
          const layer = this.layerPanel?.get(id);
          if (!layer || hiddenLayers.includes(id)) return acc;
          acc.push({
            id,
            removable: !lockedLayers.includes(id),
          });
          return acc;
        },
        []
      );
    },
    activeLayerScratches() {
      const active = this.layerPanel?.active;
      if (!active) return [];
      return this.layerPanel?.getScratches(active) ?? [];
    },
    tools() {
      return this.toolPanel?.tools.map((t) => t.constructor.name);
    },
  },
  mounted() {
    if (!this.$refs.boardContainer) return;
    this.board.setContainer(this.$refs.boardContainer as HTMLDivElement);
    this.board.init();
    this.load();
  },
  beforeUnmount() {
    this.stop();
  },
  methods: {
    start() {
      this.board?.start();
      this.startChangesStream();
      this.subscribeToChanges();
    },
    stop() {
      this.board?.stop();
      this.unsubscribeFromChanges();
      this.stopChangesStream();
    },
    init() {
      this.board.actions.dispatch(
        addObserver(this.user.id, { name: this.user.name })
      );
      setTimeout(() => {
        const layer = this.board.layers.order[1];
        if (layer) this.board.layers.setActive(layer);
        this.board.users.setActive(this.user.id);
      }, 5000);
      this.start();
    },
    async load() {
      const data = await this.boardService$.loadData(this.room);
      if (data) this.board.deserialize(data);
      this.init();
    },
    updatedHandler(data: { actions: Action[] }) {
      this.board?.actions.dispatch(data.actions, false);
    },
    subscribeToChanges() {
      this.boardService$.subscribe(this.updatedHandler);
    },
    startChangesStream() {
      this.intervalHandle = setInterval(() => {
        const actions = this.board?.actions.getInternalHistory() ?? [];
        if (actions.length) {
          this.board?.actions.clearInternalHistory();
          this.boardService$.sendData(this.room, {
            actions,
            user: this.user.id,
          });
        }
      }, 500);
    },
    stopChangesStream() {
      if (this.intervalHandle) {
        clearInterval(this.intervalHandle);
      }
    },
    unsubscribeFromChanges() {
      this.boardService$.unsubscribe(this.updatedHandler);
    },
    setTool(tool: string) {
      this.toolPanel?.setActive(tool);
    },
    setObserver(observer: User) {
      this.observerPanel?.setActive(observer.id);
    },
    changeWidth(width: number) {
      this.board?.settings.set('thickness', width);
    },
    changeColor(color: string) {
      this.board?.settings.set('color', color);
    },
    deleteScratch(id: string) {
      if (this.layerPanel?.active) {
        this.board?.actions.dispatch(
          removeScratch(id, {}, this.layerPanel.active)
        );
      }
    },
    deleteLayer(id: string) {
      this.board.actions.dispatch(removeLayer(id, {}));
    },
    createLayer() {
      const id = nanoid();
      const z = (this.layerPanel?.getMaxZIndex() ?? 0) + 1;
      this.board.actions.dispatch(createLayer(id, z, {}));
      this.board.layers.setActive(id);
    },
    selectLayer(layerId: string) {
      this.layerPanel?.setActive(layerId);
    },
  },
};
</script>

<!-- :line-width="toolPanel.thickness" -->
<!-- :color="toolPanel.color" -->
<template>
  <div id="board-container" ref="boardContainer"></div>
  <RightPanel
    :layers="layers"
    :scratches="activeLayerScratches"
    class="right-panel"
    @change-width="changeWidth"
    @change-color="changeColor"
    @delete-scratch="deleteScratch"
    @delete-layer="deleteLayer"
    @create-layer="createLayer"
    @select-layer="selectLayer"
  />
  <ToolBar
    class="toolbar"
    :tools="tools"
    :active="toolPanel?.active"
    @change-tool="setTool"
  />
  <Teleport to="#header-anchor">
    <QuitButton @click="$emit('quitRoom')" />
    <ObserverBar
      class="observerbar"
      :observers="observerPanel?.users"
      :active="observerPanel?.active"
      @change-observer="setObserver"
    />
    <SettingsButton />
  </Teleport>
</template>

<style scoped lang="scss">
#board-container {
  position: relative;
  width: 100%;
  max-height: calc(100vh - 50px);
  overflow: hidden;
}

.right-panel {
  background: #222;
  width: 240px;
  box-shadow: -3px 0px 5px 0px var(--c-default-shadow);
}

.toolbar {
  cursor: default;
  z-index: 100000;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}

.observerbar {
  height: 100%;
  margin-right: 20px;
}
</style>
