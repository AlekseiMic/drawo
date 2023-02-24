<script lang="ts">
import { inject, PropType, reactive, shallowReactive } from 'vue';
import {
  Manager,
  LineTool,
  LayerManager,
  MoveTool,
  observerReducer,
  UserManager,
  PenTool,
  Action,
  DeleteTool,
  toolReducer,
  layerReducer,
  addObserver,
} from '@plugins/drawer/';
import { BoardService } from '../services/BoardService';
import ToolBar from './drawer/ToolBar.vue';
import SettingsButton from './drawer/SettingsButton.vue';
import ObserverBar from './drawer/ObserverBar.vue';
import RightPanel from './drawer/rightPanel/RightPanel.vue';
import QuitButton from './QuitButton.vue';
import { SettingsStore } from '@plugins/drawer/services/SettingsStore';

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
    board.settings = reactive(board.settings) as SettingsStore;
    board.tools.add(LineTool, MoveTool, PenTool, DeleteTool);
    board.actions.addReducer(toolReducer, observerReducer, layerReducer);

    return {
      boardService$: inject('boardService') as BoardService,
      intervalHandle: null as null | ReturnType<typeof setInterval>,
      board,
    };
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
      this.board?.tools.getActive()?.disable();
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
      }, 2000);
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
        if (!actions.length) return;

        this.board?.actions.clearInternalHistory();
        this.boardService$.sendData(this.room, {
          actions,
          user: this.user.id,
        });
      }, 100);
    },
    stopChangesStream() {
      if (!this.intervalHandle) return;
      clearInterval(this.intervalHandle);
    },
    unsubscribeFromChanges() {
      this.boardService$.unsubscribe(this.updatedHandler);
    },
  },
};
</script>

<template>
  <div id="board-container" ref="boardContainer"></div>
  <RightPanel :board="board" class="right-panel" />
  <ToolBar class="toolbar" :board="board" />
  <Teleport to="#header-anchor">
    <QuitButton @click="$emit('quitRoom')" />
    <ObserverBar :board="board" class="observerbar" />
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
