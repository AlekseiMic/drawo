<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';
import { inject } from 'vue';
import { BoardService } from '../services/BoardService';
import ConnectForm from '../components/ConnectForm.vue';
import { Storage } from '../services/Storage';

export default {
  components: {
    SimpleModal,
    ConnectForm,
  },
  setup: () => {
    const boardService$ = inject('boardService') as BoardService;
    const storage$ = inject('storage') as Storage;
    return { boardService$, storage$ };
  },
  data: function () {
    return {
      error: '',
      defaultValues: {
        username: '',
        room: '',
        create: false,
      },
    };
  },
  beforeMount() {
    this.defaultValues.username = this.storage$.name ?? '';
  },
  methods: {
    handleClose() {
      this.$router.push({ path: '/' });
    },
    async joinRoom(username: string, room: string) {
      const data = { room, username };
      const result = await this.boardService$.joinRoom(data);

      if (result.status === 'success' && result.userId) {
        this.storage$.name = username;
        this.storage$.userId = result.userId;
        this.$router.push({ path: `/board/${data.room}` });
      }
    },
    async createRoom(username: string) {
      const result = await this.boardService$.createRoom({
        username,
      });
      this.storage$.name = username;
      this.storage$.userId = result.userId;
      this.$router.push({ path: `/board/${result.room}` });
    },
    async handleSubmit(data: {
      create: boolean;
      username: string;
      room: string;
    }) {
      if (data.create) this.createRoom(data.username);
      else this.joinRoom(data.username, data.room);
    },
  },
};
</script>

<template>
  <SimpleModal
    small
    skip-outside-click
    is-open
    title="create or connect"
    @close="handleClose"
  >
    <ConnectForm :default-values="defaultValues" @submit="handleSubmit" />
  </SimpleModal>
</template>
