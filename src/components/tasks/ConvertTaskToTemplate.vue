<template>
  <v-card>
    <v-toolbar
      color="white"
      flat
      dense
    >
      <v-toolbar-title>Convert Task to Template</v-toolbar-title>
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

    <v-card-actions v-if="task">
      <v-spacer />
      <v-btn color="primary" @click="addTemplate()" :disabled="!task.title">Convert to Template</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import * as _ from 'lodash';

/* Models */
import { ITask, IUpdateTask, taskTabTypesEnum, ITaskTabs, ITemplate, IUpdateTemplate } from '@/types';
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
    addTemplate() {
      const payload: IUpdateTask = {
        user: this.user,
        task: JSON.parse(JSON.stringify(this.task)),
      };
      this.$store.dispatch('tasks/cloneTask', payload)
        .then((resp: any) => {
          this.closeDialog();
        })
        .catch((error: any) => {
          console.error('Error converting to template:', error);
        });
    },

    closeDialog() {
      this.task = null;
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
          this.task = JSON.parse(JSON.stringify(task)) as ITemplate;
          /* Make template */
          this.task.template = true;

          /* Empty members and roles */
          this.task.members = [this.user.id];
          this.task.roles.owners = [this.user.id];
          this.task.roles.writers = [];
          this.task.roles.viewers = [];
          /* Set & Reset ID */
          this.task.sourceId = this.task.id;
          delete(this.task.id);

        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
