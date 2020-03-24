<template>
  <v-app id="vApp" v-if="authSet">
    <v-content>
      <v-container
        fluid
      >
        <h2>Extension</h2>

        <v-list>
          <v-list-item v-for="(task) in tasks" :key="task.id">
            <v-list-item-title @click.stop="openSidebar('/task/' + task.id, false)">{{ task.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External libs */
import * as Bowser from 'bowser';

/* Models */
import { IBasePayload, IOpenSidebar, IExtensionSidebarState, IEnvState, EnvPlatformsEnum, IEnvBrowser  } from '@/types';

export default Vue.extend({
  name: 'ExtensionPopup',

  data: () => ({
    //
  }),
  mounted() {
    console.log('extensio mounted');
    if (this.user && !this.tasks) {
      const payload: IBasePayload = {
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
  created() {
    const browser = Bowser.getParser(window.navigator.userAgent);

    this.$store.dispatch('base/setExtensionId', window.chrome.runtime.id);
    const envPayload: IEnvState = {
      platform: EnvPlatformsEnum.EXTENSION,
      browser: browser.getBrowser() as IEnvBrowser,
    };
    this.$store.commit('base/setEnv', envPayload);

    /* Get this window details */
    window.chrome.runtime.sendMessage({ type: 'getMyWindow' }, (res: any) => {
      vm.$store.commit('base/setExtensionIds', res);
    });

    /* Check if sidebar is set */
    window.chrome.runtime.sendMessage({ type: 'getSidebar' });

    window.chrome.runtime.sendMessage({ type: 'getLastFocused' }, (res: any) => {
      // Set initial value of main window
      vm.$store.commit('base/setExtensionLastFocused', res.lastFocusedWindowId);
    });

    /* Listen for window update */
    const vm = this;

    /* Listeners */
    window.chrome.runtime.onMessage.addListener( function(response: any, sender: any, sendResponse: any) {
      /* Listen for window update */
      if (response.type === 'setSidebar') {
        /* Listen for sidebar update */
        const payload: IExtensionSidebarState = {
          sidebarWindowId: response.sidebarWindowId,
          sidebarTabId: response.sidebarTabId,
        };
        vm.$store.dispatch('base/setExtensionSidebar', payload);
      } else if (response.type === 'setLastFocusedWindow') {
        vm.$store.commit('base/setExtensionLastFocused', response.windowId);
      }
    });
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

  watch: {
    user(value: any) {
      if (value !== null && value !== undefined && !this.tasks) {
        const payload: IBasePayload = {
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
