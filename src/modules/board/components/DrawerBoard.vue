<script lang="ts">
import { inject, PropType, reactive, shallowReactive } from 'vue';
import {
  Manager,
  LineTool,
  ToolManager,
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
  Layer,
} from '../../../plugins/drawer/';
import { BoardService } from '../services/BoardService';
import ToolBar from './drawer/ToolBar.vue';
import SettingsButton from './drawer/SettingsButton.vue';
import ObserverBar from './drawer/ObserverBar.vue';
import RightPanel from './drawer/rightPanel/RightPanel.vue';
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
  setup(props) {
    const board = new Manager(props.user.id);
    board.tools = shallowReactive(board.tools);
    board.layers = reactive(board.layers) as LayerManager;
    board.users = reactive(board.users) as UserManager;

    board.tools.add(LineTool, MoveTool, PenTool, DeleteTool);
    board.actions.addReducer(toolReducer, observerReducer);

    return {
      boardService$: inject('boardService') as BoardService,
      intervalHandle: null as null | ReturnType<typeof setInterval>,
      users: reactive({}) as Record<string, string>,
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
  watch: {
    room: {
      handler(next, current) {},
      immediate: true,
    },
    user: {
      handler(next, current) {
        this.users[current?.id ?? next.id] = next.name;
      },
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
      this.board?.start();
      this.subscribeToChanges();
      this.startChangesStream();
    },
    stop() {
      this.board?.stop();
      this.unsubscribeFromChanges();
      this.stopChangesStream();
    },
    updatedHandler(data: { actions: Action[] }) {
      this.board?.actions.dispatch(data.actions, false);
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
        const newUser = new User(user.id);
        this.observerPanel?.add(newUser);
      }
      if (action === 'leave') {
        delete this.users[user.id];
        if (this.observerPanel?.active === user.id) {
          const self = this.observerPanel.users.find(
            (o) => o.id === this.user.id
          );
          this.observerPanel?.setActive(self?.id);
        }
        this.observerPanel?.remove(user.id);
      }
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
      this.layerPanel?.remove(id);
    },
    createLayer() {
      const layer = new Layer((this.layerPanel?.getMaxZIndex() ?? 0) + 1);
      this.layerPanel?.add(layer);
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
      :users="users"
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
