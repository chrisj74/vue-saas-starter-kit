<template>
  <div>
    <v-card>
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-toolbar-title>Home</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div>Home card</div>
      </v-card-text>
    </v-card>

  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */

/* Models */

export default Vue.extend({
  name: 'Home',
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
});
</script>
