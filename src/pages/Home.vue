<template>
    <example></example>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

import Example from '../components/Example.vue';

export default Vue.extend({
  name: 'Home',
  components: { Example },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
    }),
  },
  methods: {
    onLogout() {
      this.$store.dispatch('user/logout', this as Vue);
    },
  },
});
</script>
