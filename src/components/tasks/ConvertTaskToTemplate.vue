<template>
  <v-card>
    <v-toolbar
      color="white"
      flat
      dense
    >
      <v-toolbar-title>Edit Task</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog();">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text v-if="task">
      <v-form>
        <v-switch v-model="task.public" class="ma-2" label="Make public"></v-switch>
        <v-text-field
          label="Task name"
          name="title"
          type="text"
          v-model="task.title"
        />
        <v-spacer></v-spacer>
        <v-text-field
          label="Description"
          name="description"
          type="text"
          v-model="task.description"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { ITask, IUpdateTask, taskTabTypesEnum, ITaskTabs, ITemplate } from '@/types';
import { newTaskTabs } from '@/utils';

export default Vue.extend({
  name: 'ConvertTaskToTemplate',
  props: ['taskId'],
  data() {
    return {
      task: null as unknown as ITemplate,
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

    closeDialog() {
      this.$emit('doClose');
    },

  },
  watch: {
    tasks: {
      handler(newVal, oldVal): void {
        const task: ITask = this.tasks.find((tsk: ITask) => {
          return tsk.id === this.taskId;
        });
        if (!this.task) {
          this.task = JSON.parse(JSON.stringify(task)) as ITask;
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
