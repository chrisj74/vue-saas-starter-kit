<template>
  <v-container>
    <v-row>
      <v-col :cols="allWindows && allWindows.length > 0 ? 9 : 12" v-if="task">
        <task-item :taskId="task.id" :task="task" :collection="false"></task-item>
      </v-col>
      <!-- TABS -->
      <v-col cols="3" v-if="allWindows && allWindows.length > 0" class="tab-list">
        <v-list
          elevation="1"
          dense
          rounded
          v-for="(windowGroup, winIndex) in allWindows"
          :key="'windowGroup-' + winIndex"
          class="mb-1">
          <v-subheader>WINDOW {{ winIndex + 1 }} - TABS</v-subheader>
          <draggable
            v-model="allWindows[winIndex].tabs"
            :move="changeOrder"
            :group="{ name: 'itemLinks', pull: 'clone', put: false }"
            :clone="cloneLink"
            draggable=".tab-item">
            <div v-for="(tab, tabIndex) in allWindows[winIndex].tabs" :key="'tabItem-' + tab.id" class="tab-item">
              <v-list-item >
                <v-list-item-content>
                  <v-list-item-title>{{ tab.title }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-avatar v-if="tab.favIconUrl" size="20">
                  <v-img :src="tab.favIconUrl"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-divider v-if="tabIndex < (allWindows[winIndex].tabs.length -1)" :key="'divider-' + tab.id"></v-divider>
            </div>
          </draggable>
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

/* External components */
import * as draggable from 'vuedraggable';

/* App components */
import AddTask from '@/components/tasks/AddTask.vue';
import TaskItem from '@/components/tasks/TaskItem.vue';

/* Models */
import { ITask, EnvPlatformsEnum, IOpenSidebar, ITaskLink } from '@/types';

export default Vue.extend({
  name: 'Task',
  components: { AddTask, TaskItem, draggable },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
      allWindows: 'tasks/getAllWindows',
    }),
    task() {
      return this.$store.getters['tasks/getTemplateById'](this.$router.currentRoute.params.id);
    },
  },
  methods: {
    cloneLink(item: any) {
      this.$store.commit('tasks/setShowLinks');
      const clonedItem = JSON.parse(JSON.stringify(item));
      /* Check if tab is suspended by great suspender extension */
      if (clonedItem.url.indexOf('chrome-extension://') !== -1
        && clonedItem.url.indexOf('suspended.html') !== -1
        && clonedItem.url.indexOf('&uri=') !== -1
      ) {
        clonedItem.url = clonedItem.url.substring(clonedItem.url.indexOf('&uri=') + 5);
      }
      const newItem: ITaskLink = {
        title: clonedItem.title,
        url: clonedItem.url,
        favIconUrl: clonedItem.favIconUrl,
        modified: new Date(),
      };
      return newItem;
    },

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
