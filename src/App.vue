<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { IBasePayload } from '@/types';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    if (this.user && !this.tasks) {
      const payload: IBasePayload = {
        vm: this,
        user: this.user,
      };
      this.$store.dispatch('tasks/setTasks', payload);
    }
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
  },
  methods: {
    //
  },

  watch: {
    user(value: any) {
      if (value !== null && value !== undefined && !this.tasks) {
        const payload: IBasePayload = {
          vm: this,
          user: this.user,
        };
        this.$store.dispatch('tasks/setTasks', payload);
      }
    }
  },
});
</script>
