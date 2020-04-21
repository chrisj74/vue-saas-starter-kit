<template>
  <div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import { uuid } from 'uuidv4';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { IWorkBook, IWorkBookPage } from '@/types';

export default Vue.extend({
  name: 'TextEditor',
  components: {  },
  data() {
    return {
      appStrings,
      pdfPath: null,
      currentPage: 0,
      pageCount: 0,
    };
  },
  created() {
    // Created
  },
  mounted() {
    // Mounted
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookPages: 'workBook/getWorkBookPages',
      workBookPage: 'workBook/getWorkBookPage',

    }),
  },
  methods: {
    // Methods
  },
});
</script>
