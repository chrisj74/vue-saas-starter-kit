<template>
  <v-app id="vApp" v-if="authSet">
    <v-content>
      <v-container
        fluid
      >
        <h2>Extension</h2>

        <v-list>
          <v-list-item v-for="(task) in tasks" :key="task.id">
            <v-list-item-title>{{ task.title }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-btn @click="openSidebar()">Open sidebar</v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { IBasePayload } from '@/types';

export default Vue.extend({
  name: 'ExtensionPopup',

  data: () => ({
    //
  }),
  mounted() {
    console.log('extensio mounted');
    if (this.user && !this.tasks) {
      const payload: IBasePayload = {
        vm: this,
        user: this.user,
      };
      this.$store.dispatch('tasks/setTasks', payload);
    }
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
      authSet: 'user/getAuthSet',
    }),
  },
  methods: {
    openSidebar() {
    const popupURL = window.chrome.runtime.getURL('sidebar.html');
    const windowWidth = Math.floor(window.screen.availWidth);
    const windowHeight = Math.floor(window.screen.availHeight);
    console.log('popupURL=', popupURL);
    const popupWidth = 500;
    window.chrome.windows.getCurrent({populate: false}, function(currentWindow: any) {
      /* get the current window so we can set it back on leave */
      window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id},
       function(res: any) {
        console.log('currentWindow.id=', currentWindow.id);
        /* set the current window size */
        window.chrome.windows.update(currentWindow.id, { width: (windowWidth - popupWidth), top: 0, left: 0 });
        if (!res.popupWindowId) {
          /* Not open so open */
          window.chrome.windows.create({
            url: popupURL,
            type: 'normal',
            height: windowHeight,
            width: popupWidth,
            top: 0,
            left: (windowWidth - popupWidth),
          });
        } else {
          /* Already open so just focus */
          window.chrome.windows.update(res.popupWindowId, { focused: true });
        }
        window.close();
      });
    });
    },
  },

  watch: {
    user(value: any) {
      if (value !== null && value !== undefined && !this.tasks) {
        const payload: IBasePayload = {
          vm: this,
          user: this.user,
        };
        this.$store.dispatch('tasks/setTasks', payload);
      }
    },
  },
});
</script>

<style lang="scss">
#app {
  width: 500px;
}
</style>
