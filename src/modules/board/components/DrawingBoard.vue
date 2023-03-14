<script lang="ts">
import { inject, PropType, reactive, ref, shallowReactive } from 'vue';
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
  SettingsStore,
} from '@plugins/drawer/';
import ToolBar from './ToolBar.vue';
import ObserverBar from './ObserverBar.vue';
import RightPanel from './rightPanel/RightPanel.vue';
import QuitButton from './buttons/QuitButton.vue';
import { BoardService } from '../services/BoardService';

export default {
  components: { ToolBar, ObserverBar, RightPanel, QuitButton },
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
    const loading = ref(true);

    return {
      boardService$: inject('boardService') as BoardService,
      intervalHandle: null as null | ReturnType<typeof setInterval>,
      board,
      loading,
    };
  },
  watch: {
    loading(value) {
      if (!value) {
        const layer = this.board.layers.order[1];
        if (layer) this.board.layers.setActive(layer);
        this.board.users.setActive(this.user.id);
      }
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
      this.board?.tools.getActive()?.disable();
      this.unsubscribeFromChanges();
      this.stopChangesStream();
    },
    init() {
      this.board.actions.dispatch(
        addObserver(this.user.id, { name: this.user.name })
      );
      this.start();
    },
    async load() {
      const data = await this.boardService$.loadData(this.room);
      if (data) this.board.deserialize(data);
      this.init();
      setTimeout(() => {
        this.loading = false;
      }, 300);
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
  <div v-if="loading" class="backdrop"><div class="loader"></div></div>
  <div id="board-container" ref="boardContainer"></div>
  <RightPanel :board="board" class="right-panel" />
  <ToolBar class="toolbar" :board="board" />
  <Teleport to="#header-anchor">
    <QuitButton @click="$emit('quitRoom')" />
    <ObserverBar :board="board" class="observerbar" />
  </Teleport>
</template>

<style scoped lang="scss">
.backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(25, 25, 25, 0.5);
  z-index: 1000000;
}

.loader {
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 10px solid #888;
  position: absolute;
  border-top: 10px solid blue;
  animation: spin 1s cubic-bezier(0.39, 0.575, 0.565, 1) infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
}
</style>
