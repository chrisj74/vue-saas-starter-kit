<template>
  <v-row
    align="center"
    justify="center"
  >
      <img alt="Vue logo" src="../assets/logo.png">

  </v-row>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Example',
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
});
</script>