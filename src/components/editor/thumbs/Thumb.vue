<template>
  <div class="thumb" :class="{'active': workBook && pages[pageIndex].id === currentPageId}">
    <div v-if="workBook && workBookData && pageLoaded" @click="setPage()">
      <pdf
        class="thumb-pdf"
        :src="workBookData"
        :page="pageIndex + 1"
        @page-loaded="loaded = $event"
      ></pdf>
      <img
        v-if="pages[pageIndex].drawingLayer['drawingCanvasImage']"
        :src="pages[pageIndex].drawingLayer['drawingCanvasImage']"
        class="thumb-drawing" />
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
      if (this.workBook.pages[this.pageIndex].id !== this.currentPageId) {
        this.$router.push('/workbook/' + this.workBook.id + '/' + this.workBook.pages[this.pageIndex].id);
      }
    },
  },
});
</script>

<style lang="scss">
.thumb {
  position: relative;
  width: 100%;
  cursor: pointer;
  border: 2px solid transparent;
  &.active {
    border: solid 2px #000;
  }
  .thumb-pdf {
    top: 0;
    left: 0;
    position: relative;
    z-index: 1;
  }
  .thumb-drawing{
    max-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
  }
}

</style>
