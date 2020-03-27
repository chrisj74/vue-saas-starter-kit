<template>
  <v-card class="task-item">
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
      <v-tooltip bottom v-if="!isTemplate && windowType !== windowTypeEnum.SIDEBAR">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click.native="openSidebar('/task/' + task.id, false)">
            <v-icon>
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </template>
        <span>Open Workalong</span>
      </v-tooltip>
      <!-- Menu -->
      <v-menu offset-y v-model="showTaskMenu">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <!-- Convert to template -->
          <v-list-item @click.stop="showConvertDialog = true" v-if="!isTemplate">
            <v-list-item-content>
              <v-list-item-title>Convert to template</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-swap-horizontal-variant</v-icon>
            </v-list-item-icon>
            <v-dialog
              v-model="showConvertDialog"
              width="80vw"
            >
              <convert-task-to-template @doClose="showConvertDialog = false; showTaskMenu = false;" :task="task"></convert-task-to-template>
            </v-dialog>
          </v-list-item>
          <!-- Edit -->
          <v-list-item @click.stop="showEditDialog = true">
            <v-list-item-content>
              <v-list-item-title>Edit {{ isTemplate? 'Template' : 'Task' }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-dialog
              v-model="showEditDialog"
              width="80vw"
            >
              <edit-task @doClose="showEditDialog = false; showTaskMenu = false;" :task="task"></edit-task>
            </v-dialog>
          </v-list-item>
          <!-- Copy Link -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Copy link</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-link</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <!-- Copy -->
          <v-list-item @click="copyTask()">
            <v-list-item-content>
              <v-list-item-title>Create copy</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small>mdi-content-copy</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <!-- Delete -->
          <v-list-item @click="deleteTask()">
            <v-list-item-content>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon small color="error">mdi-delete</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <!-- Video -->
    <div v-if="task.videoObj && task.videoObj.id" class="task-video">
      <iframe
        style="width: 100%"
        :src="'https://www.youtube.com/embed/' + task.videoObj.id + '?playsinline=1'"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        :id="'youtubeVideoPlayer' + task.id"
        v-if="task.videoObj.service === 'youtube'"></iframe>
      <iframe
        :src="'https://player.vimeo.com/video/' + task.videoObj.id + '?color=80a998&title=0&byline=0&portrait=0'"
        frameborder="0" allow="autoplay; fullscreen"
        allowfullscreen
        :id="'vimeoVideoPlayer' + task.id"
        v-if="task.videoObj.service === 'vimeo'"></iframe>
    </div>

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
        <template v-for="tab in task.tabs">
          <v-tab v-if="tab.active" :href="'#tab-' + tab.type"  :key="'tab-' + tab.type">
            <v-icon small>{{ tab.icon }}</v-icon>
          </v-tab>
        </template>
      </v-tabs>
    </div>
    <div class="task-item-content">
      <v-card-text v-if="task">
        <v-tabs-items v-model="taskTab">
          <template v-for="tabContent in task.tabs">
            <v-tab-item
              v-if="tabContent.active"
              :key="'tabContent-' + tabContent.type"
              :value="'tab-' + tabContent.type"
              class="mb-10"
              >
              <!-- Cover -->
              <div v-if="tabContent.type === taskTabTypesEnum.HOME">
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>
                <p>cover</p>

                <div v-html="task.description"></div>
              </div>
              <!-- Links -->
              <div v-if="tabContent.type === taskTabTypesEnum.LINKS">
                <task-item-links :task="task">
                </task-item-links>
              </div>
              <!-- Info -->
              <div v-if="tabContent.type === taskTabTypesEnum.INFO">
                <p>INFO</p>
              </div>

              <!-- Docs -->
              <div v-if="tabContent.type === taskTabTypesEnum.DOCS">
                <p>DOCS</p>
              </div>

              <!-- Notes -->
              <div v-if="tabContent.type === taskTabTypesEnum.NOTES">
                <task-item-notes :taskId="taskId">
                </task-item-notes>
              </div>

              <!-- Youtube -->
              <div v-if="tabContent.type === taskTabTypesEnum.YOUTUBE">
                <p>YOUTUBE</p>
              </div>
            </v-tab-item>

          </template>
        </v-tabs-items>
      </v-card-text>
    </div>

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
import * as _ from 'lodash';

/* App components */
import AddTaskLink from './links/AddTaskLink.vue';
import TaskItemLinks from './links/TaskItemLinks.vue';
import TaskItemNotes from './notes/TaskItemNotes.vue';
import EditTask from './EditTask.vue';
import ConvertTaskToTemplate from './ConvertTaskToTemplate.vue';

/* Models */
import { ITask, IOpenSidebar, ITaskTabs, taskTabTypesEnum, IUpdateTask, windowTypeEnum } from '@/types';

export default Vue.extend({
  name: 'TaskItem',
  props: ['taskId', 'collection', 'task'],
  components: {
    AddTaskLink,
    draggable,
    TaskItemLinks,
    TaskItemNotes,
    EditTask,
    ConvertTaskToTemplate,
  },
  data() {
    return {
      taskTabTypesEnum,
      taskTab: null as string | null,
      showEditDialog: false,
      showConvertDialog: false,
      windowTypeEnum,
      showTaskMenu: false,
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      extension: 'base/getEextension',
      windowType: 'base/getWindowType',
      user: 'user/user',
      tasks: 'tasks/getTasks',
      templates: 'tasks/getTemplates',
      showLinks: 'tasks/getShowLinks',
    }),
    /* task(): ITask {
      const allTasks = _.concat(this.tasks, this.templates)
      return allTasks.find((task: ITask) => {
        return task.id === this.taskId;
      }) as ITask;
    }, */
    isTemplate(): boolean {
      return this.task && this.task.template;
    }
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

    deleteTask() {
      const payload: IUpdateTask = {
        task: this.task,
        user: this.user,
      };
      this.$store.dispatch('tasks/deleteTask', payload);
    },

    copyTask() {
      const newTask: ITask = JSON.parse(JSON.stringify(this.task));
      newTask.title = newTask.title + ' copy';
      const payload: IUpdateTask = {
        user: this.user,
        task: newTask,
      };
      this.$store.dispatch('tasks/cloneTask', payload)
      .then((newTaskId: string) => {
        this.$router.push('/task/' + newTaskId);
      })
      .catch((error: any) => {
        console.error(error);
      });
    },

  },
  watch: {
    showLinks: {
      handler(newVal, oldVal): void {
        this.taskTab = 'tab-' + taskTabTypesEnum.LINKS;
      },
    },

    taskTab: {
      handler(newVal, oldVal): void {
        if (this.task && this.task.currentTab !== this.taskTab) {
          const task = {...this.task};
          task.currentTab = this.taskTab ? this.taskTab : null;
          const payload: IUpdateTask = {
          user: this.user,
          task,
          };
          this.$store.dispatch('tasks/updateTask', payload);
        }
      },
    },

    task: {
      handler(newVal, oldVal): void {
        if (this.task && this.task.currentTab !== this.taskTab) {
          this.taskTab = this.task.currentTab;
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>

<style lang="scss">
.task-item-content {
  max-height: 50vh;
  overflow: auto;
}
.task-video {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  iframe, object, embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
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
