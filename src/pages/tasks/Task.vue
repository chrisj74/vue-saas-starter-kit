<template>
  <div>
    <v-row>
      <v-card v-if="task">
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <v-toolbar-title>{{ task.title }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div v-html="task.description"></div>
        </v-card-text>
      </v-card>
    </v-row>

    <add-task></add-task>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import AddTask from '@/components/AddTask.vue';

/* Models */
import { ITask } from '@/types';

export default Vue.extend({
  name: 'Task',
  components: { AddTask },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
    task() {
      return this.$store.getters['tasks/getTaskById'](this.$router.currentRoute.params.id);
    },
  },
  methods: {
    onLogout() {
      this.$store.dispatch('user/logout', this as Vue);
    },
  },
});
</script>
