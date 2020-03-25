<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External libs */
import * as Bowser from 'bowser';

/* Models */
import { IBasePayload, IEnvState, EnvPlatformsEnum, IEnvBrowser, IExtensionSidebarState } from '@/types';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const vm = this;
    if (window.chrome && window.chrome.runtime.id) {
      this.$store.dispatch('base/setExtensionId', window.chrome.runtime.id);
      const envPayload: IEnvState = {
        platform: EnvPlatformsEnum.EXTENSION,
        browser: browser.getBrowser() as IEnvBrowser,
      };
      this.$store.commit('base/setEnv', envPayload);
      /* Send message to background to pass tabId */
      window.chrome.runtime.sendMessage({ type: 'setSidebarTabId' }, (res: any) => {
        // console.log('inside sidebar tabId=', res.tabId);
      });
      window.chrome.runtime.sendMessage({ type: 'getLastFocused' }, (res: any) => {
        // Set initial value of main window
        vm.$store.commit('base/setExtensionLastFocused', res.lastFocusedWindowId);
      });

      /* Get this window details */
      window.chrome.runtime.sendMessage({ type: 'getMyWindow' }, (res: any) => {
        vm.$store.commit('base/setExtensionIds', res);
      });

      /* Mouse events */
      const bodyObj = document.getElementsByTagName('body');
      if (bodyObj) {
        bodyObj[0].addEventListener('mouseenter', (e) => {
          window.chrome.runtime.sendMessage({ type: 'sidebarMouseEnter' });
        });

        bodyObj[0].addEventListener('mouseleave', (e) => {
          window.chrome.runtime.sendMessage({ type: 'sidebarMouseLeave' });
        });
      }

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
    } else {
      const envPayload: IEnvState = {
        platform: EnvPlatformsEnum.WEBSERVER,
        browser: browser.getBrowser() as IEnvBrowser,
      };
      this.$store.commit('base/setEnv', envPayload);
    }

  },
  mounted() {
    if (this.user && !this.tasks) {
      const payload: IBasePayload = {
        user: this.user,
      };
      this.$store.dispatch('tasks/setTasks', payload);
      this.$store.dispatch('tasks/setTemplates', payload);
    }
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
    //
  },

  watch: {
    user(value: any) {
      if (value !== null && value !== undefined && !this.tasks) {
        const payload: IBasePayload = {
          user: this.user,
        };
        this.$store.dispatch('tasks/setTasks', payload);
        this.$store.dispatch('tasks/setTemplates', payload);
      }
    },
  },
});
</script>
