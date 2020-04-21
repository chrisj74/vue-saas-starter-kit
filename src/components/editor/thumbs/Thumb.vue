<template>
  <div class="thumb" :class="{'active': workBook && workBook.pages[pageIndex].id === currentPageId}">
    <div v-if="workBook && workBookData && pageLoaded" @click="setPage()">
      <pdf
        :src="workBookData"
        :page="pageIndex + 1"
        @page-loaded="loaded = $event"
      ></pdf>
    </div>
    <div v-if="loaded === 0" class="loader-wrapper">
      <v-progress-circular
        indeterminate
        color="primary"
        size="20"
        width="2"
      ></v-progress-circular>
    </div>
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
  name: 'Thumb',
  components: { pdf },
  props: ['pageIndex', 'pageLoaded'],
  data() {
    return {
      appStrings,
      loaded: 0,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookData: 'workBook/getWorkBookData',
      pages: 'workBook/getWorkBookPages',
      currentPageId: 'workBook/getCurrentPageId',
    }),
  },
  methods: {
    setPage() {
      this.$store.commit('workBook/setCurrentPageByIndex', this.pageIndex);
    },
  },
});
</script>

<style lang="scss">
.thumb {
  position: relative;
  width: 100%;
  min-height: 100px;
  padding: 3px;
  border: 2px solid transparent;
  &.active {
    border: solid 2px #000;
  }
}

</style>
