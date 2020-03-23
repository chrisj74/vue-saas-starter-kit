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
        <v-text-field
          label="Task name"
          name="title"
          type="text"
          v-model="task.title"
        />
        <v-spacer></v-spacer>
        <v-text-field
          label="Video Embed URL"
          name="video"
          type="text"
          v-model="videoPath"
        />
      </v-form>
        <draggable
        v-model="task.tabs"
        :group="{ name: 'tabs', pull: true, put: true }"
        class="row"
        >
          <v-col
            v-for="tab in task.tabs"
            :key="tab.type"
            cols="3">
            <v-card dense>
              <v-toolbar
                :color="tab.active ? 'secondary' : 'grey'"
                flat
                dense
              >
                <v-toolbar-title>
                  <v-icon>{{ tab.icon }}</v-icon>
                  {{ tab.label }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="tab.active = !tab.active;">
                  <v-icon>{{ tab.active ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                {{ tab.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </draggable>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="editTask()">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import * as draggable from 'vuedraggable';
import * as getVideoId from 'get-video-id';

/* Models */
import { ITask, IUpdateTask, ITaskTab } from '@/types';
import { newTaskTabs } from '@/utils';

export default Vue.extend({
  name: 'EditTask',
  props: ['taskId'],
  components: {
    draggable,
  },
  data() {
    return {
      task: null as unknown as ITask,
      videoPath: null as unknown as string,
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
    editTask() {
      const payload: IUpdateTask = {
        user: this.user,
        task: this.task,
      };
      this.$store.dispatch('tasks/updateTask', payload);
      this.closeDialog();
    },

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
          this.videoPath = this.task.videoPath as string;
          const newTabs = newTaskTabs();
          /* Make sure new tab types are added */
          newTabs.forEach((tab: ITaskTab) => {
            const matchedTab = this.task.tabs.find((taskTab: ITaskTab) => {
              return taskTab.type === tab.type;
            });
            if (!matchedTab) {
              this.task.tabs.push(tab);
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },

    videoPath: {
      handler(newVal, oldVal): void {
        if (this.videoPath) {
          this.task.videoPath = this.videoPath;
          this.task.videoObj = getVideoId(this.videoPath);
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
