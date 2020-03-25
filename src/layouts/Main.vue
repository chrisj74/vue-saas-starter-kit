<template>
  <v-app id="vApp" v-if="authSet">
    <v-navigation-drawer
      v-model="leftDrawerOpen"
      app
      :mobile-break-point="768"
      :clipped="$vuetify.breakpoint.mdAndUp"
      >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/tasks">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tasks</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/templates">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Templates</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="onLogout()" color="red lighten-2" dark>Logout <v-icon dark right>mdi-power-standby</v-icon></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      app
      color="secondary"
      dark
      height="40"
      >
      <v-app-bar-nav-icon @click.stop="toggleLeftDawer()" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import Vue from 'vue';

export default Vue.extend({
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      authSet: 'user/getAuthSet',
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
  },
});

</script>

<style lang="scss">

</style>