<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';
import UsernameForm from '../components/UsernameForm.vue';
import { inject, watch, ref } from 'vue';
import { BoardService } from '../services/BoardService';
import { Storage } from '../services/Storage';
import AlphaButton from '@ui/buttons/AlphaButton.vue';

export default {
  components: { UsernameForm, SimpleModal, AlphaButton },
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
      this.$router.push({ path: '/board', state: { room: this.room } });
    },
    handleSubmit() {},
    async checkRoom(route: typeof this.$route) {
      this.room = route.params.id as string;
      if (!this.room) this.$router.push('/board');
      const exist = await this.boardService$.roomExist(this.room);
      if (!exist) this.roomExist = false;
    },
  },
};
</script>

<template>
  <div>{{ username }}</div>
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
  <div v-if="roomExist && !username && !userId">
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
  <div v-if="roomExist && !isConnected">backdrop</div>
  <div v-if="connectedOnce">ALL OK</div>
</template>

<style scoped>
.error-btn {
  margin-top: 15px;
}
</style>
