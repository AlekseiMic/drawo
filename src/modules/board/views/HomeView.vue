<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';
import { inject } from 'vue';
import { BoardService, ResponseStatus } from '../services/BoardService';
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
      defaultValues: {
        username: '',
        room: '',
        create: true,
      },
      errors: {
        username: '',
        room: '',
        general: '',
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
      this.storage$.saveData({ name: username });
      this.$router.push({ path: `/board/${room}` });
    },
    async createRoom(name: string, room?: string) {
      const result = await this.boardService$.createRoom({ name, room });

      if (result.status === ResponseStatus.Success) {
        this.storage$.saveData({ name, id: result.id });
        this.$router.push({ path: `/board/${result.room}` });
      } else {
        this.errors = {
          room: 'room already exists',
          username: '',
          general: '',
        };
      }
    },
    async handleSubmit(data: {
      create: boolean;
      username: string;
      room: string;
    }) {
      if (data.create) this.createRoom(data.username, data.room);
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
    <ConnectForm
      :errors="errors"
      :default-values="defaultValues"
      @submit="handleSubmit"
    />
  </SimpleModal>
</template>
