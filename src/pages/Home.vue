<template>
  <v-container fluid>
    <div v-if="user">
      <p>CONTENT</p>
    </div>
    <!-- Auth -->
    <div v-else>
      <home-auth></home-auth>
    </div>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import HomeAuth from '@/components/home/HomeAuth.vue';

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'Home',
  components: { HomeAuth },
  data() {
    return {
      appStrings,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
    }),
    maxCols() {
      let max: number = 1;
      if (this.$vuetify.breakpoint.name === 'md') {
        max = 2;
      } else if (this.$vuetify.breakpoint.name === 'lg') {
        max = 3;
      } else if (this.$vuetify.breakpoint.name === 'xl') {
        max = 4;
      }
      return max;
    },
  },
  methods: {
    //
  },
});
</script>
