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
    <v-card-text v-if="taskTemplate">
      <v-form>
        <v-switch v-model="taskTemplate.public" class="ma-2" label="Make public"></v-switch>
        <v-text-field
          label="Task name"
          name="title"
          type="text"
          v-model="taskTemplate.title"
        />
        <v-spacer></v-spacer>
        <v-text-field
          label="Description"
          name="description"
          type="text"
          v-model="taskTemplate.description"
        />
      </v-form>
    </v-card-text>

    <v-card-actions v-if="taskTemplate">
      <v-spacer />
      <v-btn color="primary" @click="addTemplate()" :disabled="!taskTemplate.title">Convert to Template</v-btn>
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
  props: ['task'],
  data() {
    return {
      taskTemplate: null as unknown as ITemplate,
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
    task: {
      handler(newVal, oldVal): void {
        if (!this.taskTemplate) {
          this.taskTemplate = JSON.parse(JSON.stringify(this.task)) as ITemplate;
          /* Make template */
          this.taskTemplate.template = true;

          /* Empty members and roles */
          this.taskTemplate.members = [this.user.id];
          this.taskTemplate.roles.owners = [this.user.id];
          this.taskTemplate.roles.writers = [];
          this.taskTemplate.roles.viewers = [];
          /* Set & Reset ID */
          this.taskTemplate.sourceId = this.taskTemplate.id;
          delete(this.taskTemplate.id);

        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
