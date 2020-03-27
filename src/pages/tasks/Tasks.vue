<template>
  <v-container fluid>
    <add-task></add-task>
    <v-row>
      <v-col :cols="allWindows && allWindows.length > 0 ? 9 : 12">
        <v-row>
          <v-col sm="12" md="6" lg="4" xl="3" v-for="(task) in tasks" :key="'tasks-' + task.id">
            <task-item :taskId="task.id" :task="task" :collection="true"></task-item>
            <v-spacer :key="'spacer-' + task.id" class="mb-2"></v-spacer>
          </v-col>
        </v-row>

      </v-col>
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
import { ITask, ITaskLink } from '@/types';

export default Vue.extend({
  name: 'Tasks',
  data() {
    return {
      //
    };
  },
  components: { AddTask, TaskItem, draggable },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
      allWindows: 'tasks/getAllWindows',
    }),
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
  },
});
</script>

<style lang="scss">
.tab-list {
  max-height: calc(100vh - 90px);
  overflow: auto;
}
</style>
