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
      <!-- Open sidebar -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="openSidebar('/task/' + task.id, false)">
            <v-icon>
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </template>
        <span>Open Workalong</span>
      </v-tooltip>
      <!-- Menu -->
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
    <div class="task-item-tabs">
      <v-tabs
        v-model="taskTab"
        background-color="grey lighten-2"
        centered
        light
        :show-arrows="true"
        slider-size="10px"
        height="30px"
      >
      <v-tabs-slider></v-tabs-slider>

        <v-tab :href="'#tab-' + tab.type" v-for="tab in taskTabs" :key="'tab-' + tab.type">
          <v-icon small>{{ tab.icon }}</v-icon>
        </v-tab>
      </v-tabs>
    </div>
    <v-card-text>
      <v-tabs-items v-model="taskTab">
        <v-tab-item
          v-for="tabContent in taskTabs"
          :key="'tabContent-' + tabContent.type"
          :value="'tab-' + tabContent.type"
        >
          <v-card flat>
            <!-- Cover -->
            <div v-if="tabContent.type === taskTabTypesEnum.HOME">
              <p>cover</p>
              <div v-html="task.description"></div>
            </div>
            <!-- Links -->
            <task-item-links
              v-if="tabContent.type === taskTabTypesEnum.LINKS"
              :taskId="taskId">
            </task-item-links>
            <!-- Info -->
            <div v-if="tabContent.type === taskTabTypesEnum.INFO">
              <p>INFO</p>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions v-if="collection">
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
import * as draggable from 'vuedraggable';

/* App components */
import AddTaskLink from './AddTaskLink.vue';
import TaskItemLinks from './TaskItemLinks.vue';

/* Models */
import { ITask, IOpenSidebar, ITaskTabs, taskTabTypesEnum } from '@/types';

export default Vue.extend({
  name: 'TaskItem',
  props: ['taskId', 'collection'],
  components: {
    AddTaskLink,
    draggable,
    TaskItemLinks,
  },
  data() {
    return {
      taskTabTypesEnum,
      taskTab: null,
      taskTabs: [
        {
          type: taskTabTypesEnum.HOME,
          icon: 'mdi-home',
        },
        {
          type: taskTabTypesEnum.LINKS,
          icon: 'mdi-link',
        },
        {
          type: taskTabTypesEnum.INFO,
          icon: 'mdi-information',
        },
      ] as ITaskTabs,
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
    task(): ITask {
      return this.tasks.find((task: ITask) => {
        return task.id === this.taskId;
      }) as ITask;
    },
  },

  methods: {
    openSidebar(linkUrl: string, linkExternal: boolean): void {
      const payload: IOpenSidebar = {
        url: linkUrl,
        vm: this,
        env: this.env,
        external: linkExternal,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
    },
  },
});
</script>

<style lang="scss">
.task-item-tabs {
  .v-slide-group__next, .v-slide-group__prev {
    min-width: 35px;
  }
  .v-tab {
    min-width: 40px;
    padding: 0 5px;
    border-bottom: 2px solid inherit;
    &.v-tab--active {
      border-bottom: 2px solid #2fb8ac;
    }
  }
}

</style>
