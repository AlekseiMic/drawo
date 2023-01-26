<script lang="ts">
import { inject, reactive, ref } from 'vue';
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
import { Storage } from '../services/Storage';
import ToolBar from './drawer/ToolBar.vue';
import SettingsButton from './drawer/SettingsButton.vue';
import ObserverBar from './drawer/ObserverBar.vue';
import RightPanel from './drawer/RightPanel.vue';

export default {
  components: { ToolBar, SettingsButton, ObserverBar, RightPanel },
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
      intervalHandle: null as null | ReturnType<typeof setInterval>,
    };
  },
  mounted() {
    if (this.$refs.boardContainer) {
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
      this.subscribeToChanges();
      this.startChangesStream();
    },
    stop() {
      this.drawer.stop();
      this.unsubscribeFromChanges();
      this.stopChangesStream();
    },
    updatedHandler(data: { actions: Action[] }) {
      this.drawer.dispatch(data.actions, false);
    },
    subscribeToChanges() {
      this.boardService$.subscribe(this.updatedHandler);
      this.boardService$.subscribeToUsersChanges(this.updateUsersHandler);
    },
    updateUsersHandler({
      user,
      action,
    }: {
      user: { username: string; id: string };
      action: string;
    }) {
      if (action === 'join' && !this.users[user.id]) {
        this.users[user.id] = user.username;
        this.observerPanel.create(user.id);
        console.log('one');
      }
      if (action === 'left') {
        delete this.users[user.id];
      }
    },
    startChangesStream() {
      this.intervalHandle = setInterval(() => {
        const actions = this.drawer.getActionHistory();
        if (actions.length) {
          this.drawer.clearActionHistory();
          this.boardService$.sendData(this.room, {
            actions,
            user: this.drawer.user,
          });
        }
      }, 50);
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
      this.drawer.toolPanel.setActive(tool);
    },
    setObserver(observer: Observer) {
      this.drawer.setObserver(observer);
    },
    changeWidth(width: number) {
      this.drawer.toolPanel.thickness = width;
    },
    changeColor(color: string) {
      this.drawer.toolPanel.colorHex = color;
    },
  },
};
</script>

<template>
  <div id="board-container" ref="boardContainer"></div>
  <RightPanel
    :line-width="toolPanel.thickness"
    :color="toolPanel.colorHex"
    :layers="layerPanel.layersOrdered"
    :scratches="layerPanel.active?.scratches"
    class="right-panel"
    @change-width="changeWidth"
    @change-color="changeColor"
  />
  <ToolBar
    class="toolbar"
    :tools="toolPanel.tools"
    :active="toolPanel.active"
    @change-tool="setTool"
  />
  <Teleport to="#header-anchor">
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
