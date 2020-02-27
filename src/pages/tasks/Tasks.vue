<template>
  <div>
    <v-row>
      <v-card v-for="(task) in tasks" :key="task.id">
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

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :to="'/task/' + task.id">View Task</v-btn>
        </v-card-actions>
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
  name: 'Tasks',
  components: { AddTask },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
  },
  methods: {
    onLogout() {
      this.$store.dispatch('user/logout', this as Vue);
    },
  },
});
</script>
