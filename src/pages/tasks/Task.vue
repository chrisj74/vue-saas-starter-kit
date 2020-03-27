<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="task">
        <task-item :taskId="task.id" :task="task" :collection="false"></task-item>
      </v-col>
    </v-row>
    <!-- <add-task></add-task> -->
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import AddTask from '@/components/tasks/AddTask.vue';
import TaskItem from '@/components/tasks/TaskItem.vue';

/* Models */
import { ITask, EnvPlatformsEnum, IOpenSidebar } from '@/types';

export default Vue.extend({
  name: 'Task',
  components: { AddTask, TaskItem },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
    task() {
      return this.$store.getters['tasks/getTaskById'](this.$router.currentRoute.params.id);
    },
  },
  methods: {
    openSidebar() {
      const payload: IOpenSidebar = {
        url: '/task/' + this.$router.currentRoute.params.id,
        vm: this,
        env: this.env,
        external: false,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
    },
  },
});
</script>
