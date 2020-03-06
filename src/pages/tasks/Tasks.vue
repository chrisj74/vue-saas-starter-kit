<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <template v-for="(task) in tasks">
          <task-item :taskId="task.id" :key="'tasks-' + task.id"></task-item>
          <v-spacer :key="'spacer-' + task.id" class="mb-2"></v-spacer>
        </template>
      </v-col>
      <v-col cols="3">
        <v-list elevation="1" dense rounded>
          <v-subheader>TABS</v-subheader>
          <template v-for="(tab, index) in tabs" >
            <v-list-item :key="'item-' + tab.id">
              <v-list-item-content>
                <v-list-item-title>{{ tab.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ tab.url }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar v-if="tab.favicon" size="20">
                <v-img :src="tab.favicon"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-divider v-if="index < (tabs.length -1)" :key="'divider-' + tab.id"></v-divider>
          </template>
        </v-list>
      </v-col>
    </v-row>


    <add-task></add-task>
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
import { ITask } from '@/types';

export default Vue.extend({
  name: 'Tasks',
  data() {
    return {
      tabs: [
        {
          id: 1,
          title: 'tab 1',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
        {
          id: 2,
          title: 'tab 2',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
        {
          id: 3,
          title: 'tab 3',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
        {
          id: 4,
          title: 'tab 4',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
        {
          id: 5,
          title: 'tab 5',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
        {
          id: 6,
          title: 'tab 6',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
        {
          id: 7,
          title: 'tab 7',
          url: 'https://www.google.com',
          favicon: '/favicon.ico',
        },
      ],
    };
  },
  components: { AddTask, TaskItem },
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
