<script lang="ts">
import SimpleModal from '@ui/SimpleModal.vue';
import DrawingBoard from '../components/DrawingBoard.vue';
import { inject } from 'vue';
import { BoardService, ResponseStatus } from '../services/BoardService';
import { Storage } from '../services/Storage';
import AlphaButton from '@ui/buttons/AlphaButton.vue';

export default {
  components: { SimpleModal, AlphaButton, DrawingBoard },
  setup() {
    const boardService$ = inject('boardService') as BoardService;
    const storage$ = inject('storage') as Storage;
    return { boardService$, storage$ };
  },
  data() {
    const connected = false;
    const user = { name: '', id: '' };
    return { room: '', connected, error: '', user };
  },
  watch: {
    $route: {
      handler(next) {
        this.room = next.params.id + '';
      },
      immediate: true,
    },
    storage$: {
      handler(next: Storage) {
        this.user.name = next.name;
        this.user.id = next.id;
      },
      immediate: true,
    },
    room: {
      handler(next, current) {
        if (this.connected && next !== current) {
          this.quitRoom();
        }
        if (next) this.connect();
      },
      immediate: true,
    },
  },
  methods: {
    goToBoard() {
      this.$router.push('/board');
    },
    async connect() {
      const result = await this.boardService$.joinRoom({
        room: this.room,
        name: this.user.name,
        id: this.user.id,
      });

      this.connected = result.status === ResponseStatus.Success;

      if (!this.connected) this.error = 'cannot connect';

      if (result.id && result.id !== this.user.id) {
        this.storage$.saveData({ id: result.id });
      }
    },
    disconnect() {
      this.quitRoom();
      this.boardService$.disconnect();
    },
    async quitRoom() {
      if (!this.connected) return;
      await this.boardService$.quitRoom({ room: this.room, id: this.user.id });
      this.connected = false;
      this.$router.replace('/board');
    },
    handleSubmit(username: string) {
      this.storage$.name = username;
      this.user.name = username;
    },
  },
};
</script>

<template>
  <div v-if="error" class="backdrop">
    <SimpleModal
      small
      skip-outside-click
      is-open
      title="error"
      @close="goToBoard"
    >
      <p>{{ error }}</p>
      <AlphaButton class="error-btn" full @click="goToBoard">ok</AlphaButton>
    </SimpleModal>
  </div>
  <DrawingBoard
    v-if="connected"
    :user="user"
    :room="room"
    @quit-room="quitRoom"
  />
</template>

<style scoped>
.error-btn {
  margin-top: 15px;
}
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
}
</style>
