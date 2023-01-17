<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';
import UsernameForm from '../components/UsernameForm.vue';
import DrawerBoard from '../components/DrawerBoard.vue';
import { inject, watch, ref } from 'vue';
import { BoardService } from '../services/BoardService';
import { Storage } from '../services/Storage';
import AlphaButton from '@ui/buttons/AlphaButton.vue';

export default {
  components: { UsernameForm, SimpleModal, AlphaButton, DrawerBoard },
  setup() {
    const boardService$ = inject('boardService') as BoardService;
    const storage$ = inject('storage') as Storage;
    const username = ref(storage$.name);
    const userId = ref(storage$.userId);
    const room = ref('');
    const connectedOnce = ref(false);
    const isConnected = ref(false);
    const roomExist = ref<undefined | boolean>(undefined);

    watch([username, room], async ([newUsername, newRoom]) => {
      if (!newUsername || !newRoom) {
        isConnected.value = false;
        return;
      }

      const result = await boardService$.joinRoom({
        room: newRoom,
        username: newUsername,
      });

      if (result.status !== 'success') return;

      isConnected.value = true;
      connectedOnce.value = true;

      if (userId.value !== result.userId && result.userId) {
        storage$.userId = result.userId;
      }
    });

    return {
      boardService$,
      storage$,
      username,
      userId,
      room,
      connectedOnce,
      isConnected,
      roomExist,
    };
  },
  watch: {
    $route: {
      handler(route) {
        this.checkRoom(route);
      },
      immediate: true,
    },
  },
  methods: {
    handleClose() {
      this.$router.push('/board');
    },
    handleError() {
      this.$router.push({ path: '/board' });
    },
    handleSubmit(username: string) {
      this.storage$.name = username;
      this.username = username;
    },
    async checkRoom(route: typeof this.$route) {
      this.room = route.params.id as string;
      if (!this.room) this.$router.push('/board');
      this.roomExist = await this.boardService$.roomExist(this.room);
    },
  },
};
</script>

<template>
  <div v-if="roomExist === false">
    <SimpleModal
      small
      skip-outside-click
      is-open
      title="error"
      @close="handleError"
    >
      <p>room not found</p>
      <AlphaButton class="error-btn" full @click="handleError">ok</AlphaButton>
    </SimpleModal>
  </div>
  <div v-if="roomExist && !username">
    <SimpleModal
      small
      skip-outside-click
      is-open
      title="username"
      @close="handleClose"
    >
      <UsernameForm @submit="handleSubmit" />
    </SimpleModal>
  </div>
  <div v-if="roomExist && !isConnected" class="backdrop"></div>
  <DrawerBoard v-if="connectedOnce" />
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
