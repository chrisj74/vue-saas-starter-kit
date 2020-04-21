<template>
  <div class="toolbar-wrapper">

  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'Toolbar',
  components: {  },
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
      workBook: 'workBook/getWorkBook',
      pages: 'workBook/getWorkBookPages',
    }),
  },
  methods: {
    //
  },
});
</script>
