<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="task">
          <v-toolbar
            color="primary"
            dark
            flat
            dense
          >
            <v-toolbar-title>{{ task.title }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="openSidebar()">
                  <v-icon>
                    mdi-open-in-new
                  </v-icon>
                </v-btn>
              </template>
              <span>Open Workalong</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <div v-html="task.description"></div>
            <v-row>
              <v-col>

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
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

/* Models */
import { ITask, EnvPlatformsEnum, IOpenSidebar } from '@/types';

export default Vue.extend({
  name: 'Task',
  components: { AddTask },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
    task() {
      return this.$store.getters['tasks/getTaskById'](this.$router.currentRoute.params.id);
    },
  },
  methods: {
    openSidebar() {
      const payload: IOpenSidebar = {
        url: '/task/' + this.$router.currentRoute.params.id,
        vm: this,
        env: this.env,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
// const windowWidth = Math.floor(window.screen.availWidth);
// const windowHeight = Math.floor(window.screen.availHeight);
// const popupWidth = 500;
// if (this.env && this.env.platform === EnvPlatformsEnum.EXTENSION) {
//   console.log('In extension');
//   const popupURL = window.chrome.runtime.getURL('index.html');
//   const vm = this as Vue;
//   window.chrome.windows.getCurrent({populate: false}, function(currentWindow: any) {
//     /* get the current window so we can set it back on leave */
//     window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id},
//     function(res: any) {
//       console.log('currentWindow.id=', currentWindow.id);
//       /* set the current window size */
//       window.chrome.windows.update(currentWindow.id, { width: (windowWidth - popupWidth), top: 0, left: 0 });
//       if (!res.popupWindowId) {
//         /* Not open so open */
//         window.chrome.windows.create({
//           url: popupURL + '/#/task/' + vm.$router.currentRoute.params.id,
//           type: 'normal',
//           height: windowHeight,
//           width: popupWidth,
//           top: 0,
//           left: (windowWidth - popupWidth),
//         });
//       } else {
//         /* Already open so just focus */
//         window.chrome.windows.update(res.popupWindowId, { focused: true });
//       }
//     });
//   });
// } else if (this.env && this.env.platform === EnvPlatformsEnum.WEBSERVER) {
//   console.log('In web app');
//   window.resizeTo((windowWidth - popupWidth), windowHeight);
//   window.moveTo(0, 0);
//   window.open(
//     '/#/task/' + this.$router.currentRoute.params.id,
//     'workalongo',
//     'top=0, left=' + (windowWidth - popupWidth) + ', width=' + popupWidth + ', height=' + windowHeight + ',toolbar=1, scrollbars=1, location=1, statusbar=1, menubar=1');
// }
    },
  },
});
</script>
