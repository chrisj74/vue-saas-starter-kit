<template>
  <v-app id="vApp" v-if="authSet">
    <router-view></router-view>
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