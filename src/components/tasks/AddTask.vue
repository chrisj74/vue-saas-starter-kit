<template>
  <v-dialog
      v-model="dialog"
      width="500"
    >
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        dark
        v-on="on"
      >
        Add task
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="white"
        flat
        dense
      >
        <v-toolbar-title>Add New Task</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
  </v-dialog>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { ITask, IUpdateTask, taskTabTypesEnum, ITaskTabs, taskRolesEnum, IUser } from '@/types';
import { newTaskTabs } from '@/utils';

export default Vue.extend({
  name: 'Addtask',

  data() {
    return {
      dialog: false,
      newTask: {
        members: [],
        roles: {
          owners: [],
          writers: [],
          viewers: [],
        },
        sourceId: null,
        template: false,
        keywords: [],
        categories: [],
        public: false,
        author: {
          name: '',
          avatar: '',
        },
        title: '',
        description: '',
        modified: new Date(),
        links: [],
        order: 0,
        currentTab: null,
        tabs: newTaskTabs(),
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
      this.newTask.members.push(this.user.id);
      this.newTask.roles.owners.push(this.user.id);
      this.newTask.author = {
        name: this.user.name,
        avatar: this.user.photoUrl,
      };
      this.newTask.modified = new Date();
      const payload: IUpdateTask = {
        user: this.user,
        task: this.newTask,
      };
      this.$store.dispatch('tasks/addTask', payload)
        .then((resp: any) => {
          this.closeDialog();
        })
        .catch((error: any) => {
          console.error('Error adding new task');
        });
    },

    closeDialog() {
      this.newTask = {
        members: [],
        roles: {
          owners: [],
          writers: [],
          viewers: [],
        },
        sourceId: null,
        template: false,
        keywords: [],
        categories: [],
        public: false,
        author: {
          name: '',
          avatar: '',
        },
        title: '',
        description: '',
        modified: new Date(),
        links: [],
        order: 0,
        currentTab: null,
        tabs: newTaskTabs(),
      } as ITask;
      this.dialog = false;
    },
  },
});
</script>
