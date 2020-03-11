<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External libs */
import * as Bowser from 'bowser';

/* Models */
import { IBasePayload, IEnvState, EnvPlatformsEnum, IEnvBrowser, IExtensionState, IExtensionPopupState } from '@/types';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    const browser = Bowser.getParser(window.navigator.userAgent);

    if (window.chrome && window.chrome.runtime.id) {
      this.$store.dispatch('base/setExtensionId', window.chrome.runtime.id);
      const envPayload: IEnvState = {
        platform: EnvPlatformsEnum.EXTENSION,
        browser: browser.getBrowser() as IEnvBrowser,
      };
      this.$store.commit('base/setEnv', envPayload);
      /* Send message to background to pass tabId */
      window.chrome.runtime.sendMessage({ type: 'getAllWindows' });

      /* Listeners */
      const vm = this;
      window.chrome.runtime.onMessage.addListener( function(response: any, sender: any, sendResponse: any) {
        /* Listen for window update */
        if (response.type === 'setAllWindows') {
          vm.$store.dispatch('tasks/updateAllWindows', response.allWindows);
        } else if (response.type === 'setPopup') {
          /* Listen for popup update */
          const payload: IExtensionPopupState = {
            popupWindowId: response.popupWindowId,
            popupTabId: response.popupTabId,
          };
          vm.$store.dispatch('base/setExtensionPopup', payload);
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
      }
    },
  },
});
</script>
