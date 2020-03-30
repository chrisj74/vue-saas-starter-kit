<template>
  <v-app id="vApp" v-if="authSet">
    <v-content>
      <v-container
        fluid
      >
        <div v-if="user">
          <v-card>
            <v-toolbar
              color="white"
              flat
              dense
              >
              <v-toolbar-title>Tasks</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closePopup();">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-autocomplete
                :items="tasks"
                color="white"
                item-text="title"
                item-value="id"
                label="Select task"
                v-model="selectedTask"
              ></v-autocomplete>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn @click="openSidebar('/task/' + selectedTask, false)" :disabled="!selectedTask">Open</v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div v-else>
          <home-auth></home-auth>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External libs */
import * as Bowser from 'bowser';

/* App components */
import HomeAuth from '@/components/home/HomeAuth.vue';

/* Models */
import { IBasePayload, IOpenSidebar, IExtensionSidebarState, IEnvState, EnvPlatformsEnum, IEnvBrowser  } from '@/types';

export default Vue.extend({
  name: 'ExtensionPopup',
  components: {
    HomeAuth,
  },
  data: () => ({
    selectedTask: null,
  }),
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
    window.chrome.windows.getLastFocused((windowObj: any) => {
      console.log('popup lastFocused Window=', windowObj);
    });


    /* Get this window details */
    window.chrome.runtime.sendMessage({ type: 'getMyWindow', setLastFocused: false }, (res: any) => {
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
    closePopup() {
      window.close();
    },

    openSidebar(linkUrl: string, linkExternal: boolean): void {
      const payload: IOpenSidebar = {
        url: linkUrl,
        vm: this,
        env: this.env,
        external: linkExternal,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
      window.close();
    },
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

<style lang="scss">
#vApp {
  width: 500px;
}
</style>
