<template>
  <div>
    {{currentPage}} / {{pageCount}}
    <pdf
      v-if="pdfPath"
      :src="pdfPath"
      :page="4"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
    ></pdf>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import pdf from 'vue-pdf';

/* App components */

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'ViewPdf',
  components: { pdf },
  data() {
    return {
      appStrings,
      pdfPath: null,
      currentPage: 0,
      pageCount: 0,
    };
  },
  created() {
    console.log('router', this.$route.query);
    if (this.$route.query.pdf) {
      this.pdfPath = this.$route.query.pdf;
    }
  },
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
