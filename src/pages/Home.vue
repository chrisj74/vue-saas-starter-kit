<template>
  <v-container fluid>
    <div v-if="user">
      <!-- Tasks -->
      <v-card class="mb-4">
        <v-toolbar
          color="primary"
          dark
          flat
          dense
        >
          <v-toolbar-title>Recent Tasks</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col sm="12" md="6" lg="4" xl="3" v-for="(task, taskIndex) in tasks" :key="'tasks-' + task.id">
              <task-item :taskId="task.id" :task="task" :collection="true" v-if="taskIndex <= 4"></task-item>
              <v-spacer :key="'spacer-' + task.id" class="mb-2"></v-spacer>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <add-task></add-task>
        </v-card-actions>
      </v-card>

      <!-- Templates -->
      <v-card class="mb-4">
        <v-toolbar
          color="primary"
          dark
          flat
          dense
        >
          <v-toolbar-title><router-link :to="'/templates'">Templates</router-link></v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col sm="12" md="6" lg="4" xl="3" v-for="(template) in templates" :key="'templates-' + template.id">
              <task-item :taskId="template.id" :task="template" :collection="true"></task-item>
              <v-spacer :key="'spacer-' + template.id" class="mb-2"></v-spacer>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <!-- Auth -->
    <div v-else>
      <home-auth></home-auth>
    </div>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import AddTask from '@/components/tasks/AddTask.vue';
import TaskItem from '@/components/tasks/TaskItem.vue';
import HomeAuth from '@/components/home/HomeAuth.vue';
/* Models */

export default Vue.extend({
  name: 'Home',
  components: { AddTask, TaskItem, HomeAuth },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
      templates: 'tasks/getTemplates',
    }),
  },
  methods: {
    //
  },
});
</script>
