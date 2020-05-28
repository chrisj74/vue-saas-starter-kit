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
      <v-toolbar-title><v-img src="@/assets/learnalongo-logo-purple.png" max-width="115px"></v-img></v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
      >
        <router-view></router-view>

        <extension-alert></extension-alert>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import Vue from 'vue';

/* Components */
import ExtensionAlert from '@/components/misc/ExtensionAlert.vue';

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  data() {
    return {
      appStrings,
    };
  },
  components: { ExtensionAlert },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      authSet: 'user/getAuthSet',
      extensionInstalled: 'base/getExtensionInstalled',
      env: 'base/getEnv',
      // leftDrawerOpen: 'base/getLeftDrawerOpen',
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
  methods: {
    toggleLeftDawer() {
      this.$store.dispatch('base/toggleLeftDrawerOpen');
    },
    onLogout() {
      this.$store.dispatch('user/logout', this as Vue);
    },
    onLogin() {
      this.$router.push('/');
    },
  },
});
</script>

<style lang="scss">

</style>