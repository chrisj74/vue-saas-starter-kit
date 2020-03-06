<template>
  <v-card>
    <v-toolbar
      color="primary"
      dark
      flat
      dense
      height="40"
    >
      <v-toolbar-title>{{ task.title }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="openSidebar()">
            <v-icon>
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </template>
        <span>Open Workalong</span>
      </v-tooltip>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <!-- Add -->
          <v-list-item
          >
            <v-list-item-content>
              <v-list-item-title>Add item</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-plus</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <!-- Copy -->
          <v-list-item
          >

            <v-list-item-content>
              <v-list-item-title>Copy</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-content-copy</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <!-- Edit -->
          <v-list-item
          >
            <v-list-item-content>
              <v-list-item-title>Edit title</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-text v-if="task.links">
      <div v-html="task.description"></div>
      <p v-if="task.links">Links {{ task.links.length }}</p>
      <!-- Links -->
      <v-card v-for="link of task.links" :key="'link-' + link.id">
        <v-card-text>
          <a :href="link.url">{{ link.url }}</a>
        </v-card-text>
      </v-card>
    </v-card-text>

    <v-card-actions>
      <add-task-link :task="task"></add-task-link>
      <v-spacer />
      <v-btn color="primary" :to="'/task/' + task.id">View Task</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import AddTaskLink from './AddTaskLink.vue';

/* Models */
import { IBasePayload, ITask, IAddTask, IOpenSidebar } from '@/types';

export default Vue.extend({
  name: 'TaskItem',
  props: ['taskId'],
  components: {
    AddTaskLink,
  },
  data() {
    return {
      //
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
    task() {
      return this.tasks.find((task: ITask) => {
        console.log('computed taskId=', this.taskId, ' task.id=', task.id);
        return task.id === this.taskId;
      }) as ITask;
    },
  },

  methods: {
    openSidebar() {
      const payload: IOpenSidebar = {
        url: '/task/' + this.task.id,
        vm: this,
        env: this.env,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
    },
  },
  watch: {
    task: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        console.log('watcher task=', this.task);
      },
    },
  },
});
</script>
