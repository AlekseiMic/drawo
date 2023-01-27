<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';
import DrawerBoard from '../components/DrawerBoard.vue';
import { inject } from 'vue';
import { BoardService } from '../services/BoardService';
import { Storage } from '../services/Storage';
import AlphaButton from '@ui/buttons/AlphaButton.vue';

export default {
  components: { SimpleModal, AlphaButton, DrawerBoard },
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
        this.room = next.params.id as string;
      },
      immediate: true,
    },
    storage$: {
      handler(next: Storage) {
        this.user.name = next.name;
        this.user.id = next.id;
        // console.log(next);
      },
      immediate: true,
    },
    room: {
      handler(next, current) {
        if (this.connected && next !== current) {
          this.disconnect();
        }
        this.connect();
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
        username: this.user.name,
        userId: this.user.id,
      });

      if (result.status !== 'success') {
        this.error = 'cannot connect';
        return;
      }

      this.connected = true;
      if (result.userId && result.userId !== this.user.id) {
        this.storage$.saveData({ id: result.userId });
      }
    },
    disconnect() {
      this.boardService$.disconnect();
      this.connected = false;
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
  <DrawerBoard v-if="connected" :user="user" :room="room" />
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
