<script lang="ts">
import { inject, shallowReactive, PropType, reactive, ref } from 'vue';
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
  Action,
} from '../../../plugins/drawer/';
import { BoardService } from '../services/BoardService';
import ToolBar from './drawer/ToolBar.vue';
import SettingsButton from './drawer/SettingsButton.vue';
import ObserverBar from './drawer/ObserverBar.vue';
import RightPanel from './drawer/RightPanel.vue';
import QuitButton from './QuitButton.vue';

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
  setup() {
    return {
      boardService$: inject('boardService') as BoardService,
    };
  },
  data() {
    const board = shallowReactive(new Manager(this.user.id));

    const toolPanel = shallowReactive(new ToolPanel(board));

    toolPanel.addTools(LineTool, MoveTool, PenTool);

    const layerPanel = shallowReactive(new LayerPanel());

    const observerPanel = shallowReactive(new ObserverPanel());
    observerPanel.observers = shallowReactive([]);

    observerPanel.active = observerPanel.create(this.user.id);

    board.addReducers(toolPanel.gerReducer(), observerReducer);
    board.toolPanel = toolPanel;
    board.layers = layerPanel;
    board.observers = observerPanel;

    return {
      intervalHandle: null as null | ReturnType<typeof setInterval>,
      users: { [this.user.id]: this.user.name } as Record<string, string>,
      board,
      toolPanel,
      layerPanel,
      observerPanel,
    };
  },
  watch: {
    room: {
      handler(next, current) {},
      immediate: true,
    },
    user: {
      handler(next, current) {},
      immediate: true,
    },
  },
  mounted() {
    if (!this.$refs.boardContainer) return;
    this.board.setContainer(this.$refs.boardContainer as HTMLDivElement);
    this.board.init();
    this.start();
  },
  beforeUnmount() {
    this.stop();
  },
  methods: {
    start() {
      this.board.start();
      this.subscribeToChanges();
      this.startChangesStream();
    },
    stop() {
      this.board.stop();
      this.unsubscribeFromChanges();
      this.stopChangesStream();
    },
    updatedHandler(data: { actions: Action[] }) {
      this.board.dispatch(data.actions, false);
    },
    subscribeToChanges() {
      this.boardService$.subscribe(this.updatedHandler);
      this.boardService$.subscribeToUsersChanges(this.updateUsersHandler);
    },
    updateUsersHandler({
      user,
      action,
    }: {
      user: { name: string; id: string };
      action: string;
    }) {
      if (action === 'join' && !this.users[user.id]) {
        this.users[user.id] = user.name;
        this.observerPanel.create(user.id);
      }
      if (action === 'leave') {
        delete this.users[user.id];
        if (this.observerPanel.active?.id === user.id) {
          const self = this.observerPanel.observers.find(
            (o) => o.id === this.user.id
          );
          this.observerPanel.active = self ?? null;
        }
        this.observerPanel.remove(user.id);
      }
    },
    startChangesStream() {
      this.intervalHandle = setInterval(() => {
        const actions = this.board.getActionHistory();
        if (actions.length) {
          this.board.clearActionHistory();
          this.boardService$.sendData(this.room, {
            actions,
            user: this.board.user,
          });
        }
      }, 100);
    },
    stopChangesStream() {
      if (this.intervalHandle) {
        clearInterval(this.intervalHandle);
      }
    },
    unsubscribeFromChanges() {
      this.boardService$.unsubscribe(this.updatedHandler);
      this.boardService$.unsubscribeToUsersChanges(this.updateUsersHandler);
    },
    setTool(tool: string) {
      this.board.toolPanel.setActive(tool);
    },
    setObserver(observer: Observer) {
      this.board.setObserver(observer);
    },
    changeWidth(width: number) {
      this.board.toolPanel.thickness = width;
    },
    changeColor(color: string) {
      this.board.toolPanel.colorHex = color;
    },
    deleteScratch(id: string) {
      console.log(this.layerPanel.active);
      this.board.removeScratch(this.layerPanel.active, id);
    },
    deleteLayer(id: string) {
      delete this.layerPanel.layers[id];
    },
  },
};
</script>

<template>
  <div id="board-container" ref="boardContainer"></div>
  <RightPanel
    :line-width="toolPanel.thickness"
    :color="toolPanel.colorHex"
    :layers="(layerPanel as LayerPanel).layersOrdered"
    :scratches="layerPanel.activeScratchesRef.value"
    class="right-panel"
    @change-width="changeWidth"
    @change-color="changeColor"
    @delete-scratch="deleteScratch"
    @delete-layer="deleteLayer"
  />
  <ToolBar
    class="toolbar"
    :tools="toolPanel.tools"
    :active="toolPanel.active"
    @change-tool="setTool"
  />
  <Teleport to="#header-anchor">
    <QuitButton @click="$emit('quitRoom')" />
    <ObserverBar
      class="observerbar"
      :observers="observerPanel.observers"
      :users="users"
      :active="observerPanel.active"
      @change-observer="setObserver"
    />
    <SettingsButton />
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
