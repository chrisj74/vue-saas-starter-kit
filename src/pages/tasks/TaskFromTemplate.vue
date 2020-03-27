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
  name: 'TaskFromTemplate',
  components: { AddTask, TaskItem },
  data() {
    return {
      task: null as unknown as ITask,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
    }),
  },
  mounted() {
    if (this.user) {
      // work out what to do.
    } else {
      this.$store.dispatch('tasks/fetchTemplate', this.$router.currentRoute.params.id)
      .then((newTask: ITask) => {
        this.task = JSON.parse(JSON.stringify(newTask));
        this.task.template = false;
        delete(this.task.id);
      })
      .catch((error: any) => {
        console.error('Error getting template: ', error);
      });
    }
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
