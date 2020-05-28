<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External libs */
import * as Bowser from 'bowser';

/* Models */
import { IBasePayload, IEnvState, EnvPlatformsEnum, IEnvBrowser, IExtensionState, IExtensionSidebarState } from '@/types';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const vm = this;
    if (browser.getBrowser().name === 'chrome'
      && window.chrome
      && window.chrome.runtime
      && window.chrome.runtime.id) {
      this.$store.dispatch('base/setExtensionId', window.chrome.runtime.id);
      const envPayload: IEnvState = {
        platform: EnvPlatformsEnum.EXTENSION,
        browser: browser.getBrowser() as IEnvBrowser,
      };
      this.$store.commit('base/setEnv', envPayload);
      /* Send message to background to pass tabId */
      window.chrome.runtime.sendMessage({ type: 'xxx' });

      /* Listeners */
      window.chrome.runtime.onMessage.addListener( function(response: any, sender: any, sendResponse: any) {
        /* Listen for window update */
        if (response.type === 'xxx') {
          // Do something
        }
      });
    } else {
      const envPayload: IEnvState = {
        platform: EnvPlatformsEnum.WEBSERVER,
        browser: browser.getBrowser() as IEnvBrowser,
      };
      this.$store.commit('base/setEnv', envPayload);
      if (browser.getBrowser().name === 'chrome'
        && window.chrome
        && window.chrome.runtime) {
        window.chrome.runtime.sendMessage('kjgfkclnoeklafdfjjhhdmmihgjpfhha',
        { type: 'ping' }, function(response: any) {
          if (response && response.type === 'pong') {
            vm.$store.commit('base/setExtensionInstalled', true);
          }
        });
      }
    }
  },
  mounted() {
    if (this.user) {
      this.$store.dispatch('workBook/setWorkBooks');
      this.$store.dispatch('noteBook/setNoteBooks');
    }
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
    }),
  },
  methods: {
    //
  },

  watch: {
    user: {
      handler(newVal, oldVal): void {
        if (newVal !== null && newVal !== undefined) {
          const payload: IBasePayload = {
            user: this.user,
          };
          // TODO DISPATCH
        } else if (!newVal) {
          // TODO DISPATCH CLEAR
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
