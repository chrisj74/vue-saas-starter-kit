<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-toolbar-title>Add New Task</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Task name"
            name="title"
            type="text"
            v-model="newTask.title"
          />

        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="addTask()" :disabled="!newTask.title">Add Task</v-btn>
      </v-card-actions>
    </v-card>

  </v-row>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { IBasePayload, ITask, IAddTask } from '@/types';

export default Vue.extend({
  name: 'Addtask',

  data() {
    return {
      newTask: {
        title: '',
        description: '',
        modified: new Date(),
      } as ITask,
    };
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
    addTask(): void {
      this.newTask.modified = new Date();
      const payload: IAddTask = {
        vm: this,
        user: this.user,
        task: this.newTask,
      };
      this.$store.dispatch('tasks/addTask', payload)
        .then((resp) => {
          this.newTask = {
            title: '',
            description: '',
            modified: new Date(),
          };
        })
        .catch((error) => {
          console.error('Error adding new task');
        });
    },
  },
});
</script>
