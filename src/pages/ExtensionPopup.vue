<template>
  <v-app id="vApp" v-if="authSet">
    <v-navigation-drawer
      disable-resize-watcher
      v-model="leftDrawerOpen"
      app
      :mobile-break-point="768"
      :clipped="$vuetify.breakpoint.mdAndUp"
      >
      <v-list dense>
        <!-- HOME -->
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- WORK BOOKS -->
        <v-list-item link to="/workbooks">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ appStrings.TASK }} Work Books</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- NOTE BOOKS -->
        <v-list-item link to="/notebooks">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ appStrings.TASK }} Note Books</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- LOGIN/OUT -->
      <template v-slot:append>
        <div class="pa-2" v-if="user">
          <v-btn block @click="onLogout()" color="red lighten-2" dark>Logout <v-icon dark right>mdi-power-standby</v-icon></v-btn>
        </div>
        <div class="pa-2" v-else>
          <v-btn block @click="onLogin()" dark>Login <v-icon dark right>mdi-power-standby</v-icon></v-btn>
        </div>
      </template>

    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      app
      color="white"
      light
      height="40"
      >
      <v-app-bar-nav-icon @click.stop="toggleLeftDawer()" />
      <v-toolbar-title><v-img src="@/assets/learnalongo-logo-purple.svg" max-width="115px"></v-img></v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon @click="closePopup()">mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

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

            </v-toolbar>

            <v-card-text>
              TEXT
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn @click="newNote()">New Note Book</v-btn>
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
import { appStrings } from '@/utils';
import { IBasePayload, IExtensionSidebarState, IEnvState, EnvPlatformsEnum, IEnvBrowser  } from '@/types';

export default Vue.extend({
  name: 'ExtensionPopup',
  components: {
    HomeAuth,
  },
  data: () => ({
    selectedTask: null,
    appStrings,
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
      workBooks: 'workBook/getWorkBooks',
      noteBooks: 'noteBook/getNoteBooks',
    }),
    leftDrawerOpen: {
      get() {
        return this.$store.getters['base/getLeftDrawerOpen'];
      },
      set(val) {
        this.$store.commit('base/setLeftDrawerOpen', val);
      },
    },
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
    newNote() {
      const vm = this;
      window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any) {
        window.chrome.tabs.sendMessage(tabs[0].id, {type: 'newNote'}, function(response: any) {
          // deal with response if any
          vm.closePopup();
        });
      });
    },

    closePopup() {
      window.close();
    },

    toggleLeftDawer() {
      this.$store.dispatch('base/toggleLeftDrawerOpen');
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
