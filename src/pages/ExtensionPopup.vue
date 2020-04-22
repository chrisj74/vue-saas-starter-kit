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
              <v-toolbar-title>TITLE</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closePopup();">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              TEXT
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn>ACTION</v-btn>
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
import { IBasePayload, IExtensionSidebarState, IEnvState, EnvPlatformsEnum, IEnvBrowser  } from '@/types';

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
      /* DISPATCH */
    }
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
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


    /* Listen for window update */
    const vm = this;

    /* Listeners */
    window.chrome.runtime.onMessage.addListener( function(response: any, sender: any, sendResponse: any) {
      // ADD listeners
    });
  },
  methods: {
    closePopup() {
      window.close();
    },
  },

  watch: {
    user(value: any) {
      if (value !== null && value !== undefined && !this.tasks) {
        const payload: IBasePayload = {
          user: this.user,
        };
        /* DISPATCH */
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
