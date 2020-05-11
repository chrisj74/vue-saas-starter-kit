<template>
  <div class="page-wrapper" ref="page">
    <page-setup></page-setup>
    <download></download>
    <div
      v-if="pageDimensions"
      class="page"
      :style="{width: pageDimensions.width+'px', height: pageDimensions.height+'px'}">
      <view-pdf>
      </view-pdf>

      <drawing-canvas>
      </drawing-canvas>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */

/* App components */
import Download from '@/components/editor/download/Download.vue';
import ViewPdf from '@/components/editor/page/ViewPdf.vue';
import Thumbs from '@/components/editor/page/ViewPdf.vue';
import DrawingCanvas from '@/components/editor/page/DrawingCanvas.vue';
import PageSetup from '@/components/editor/page/PageSetup.vue';


/* Utils */
import { appStrings } from '@/utils';
import { IWorkBookPageDimensions, toolActionEnum } from '@/types';

export default Vue.extend({
  name: 'Page',
  components: { ViewPdf, DrawingCanvas, PageSetup, Download },
  data() {
    return {
      appStrings,
      windowWidth: 1024,
      maxHeightRatio: 0,
      maxWidthRatio: 0,
      pageHeight: 0,
      scrolling: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookPage: 'workBook/getWorkBookPage',
      pageDimensions: 'workBook/getCurrentPageDimensions',
      toolAction: 'workBook/getToolAction',
    }),
  },
  mounted() {
    const vm = this;
    if (this.workbook && this.workBookPage.dimensions && !this.pageDimensions) {
      if (this.workbookPage) {
        vm.setDefaultZoom();
      }
    }
    window.addEventListener('resize', function(event) {
      vm.windowWidth = window.innerWidth;
      vm.$nextTick()
          .then(function() {
              // DOM updated
              vm.setDefaultZoom();
          });
    }, {passive: true});
  },
  methods: {
    setDefaultZoom() {
      if (this.workBookPage && this.$refs.page.clientWidth) {
        this.pageHeight = this.$refs.page.clientHeight;
        this.maxHeightRatio = this.$refs.page.clientHeight / this.workBookPage.dimensions.height;
        this.maxWidthRatio = this.$refs.page.clientWidth / this.workBookPage.dimensions.width;

        let dimensions: IWorkBookPageDimensions;
        if (this.maxHeightRatio < this.maxWidthRatio) {
          dimensions = {
            maxWidth: this.$refs.page.clientWidth,
            maxWidthRatio: this.maxWidthRatio,
            maxHeightRatio: this.maxHeightRatio,
            height: (this.workBookPage.dimensions.height * this.maxHeightRatio),
            width: (this.workBookPage.dimensions.width * this.maxHeightRatio),
            zoom: this.maxHeightRatio,
            pixelRatio: window.devicePixelRatio,
          };
        } else {
          dimensions = {
            maxWidth: this.$refs.page.clientWidth,
            maxWidthRatio: this.maxWidthRatio,
            maxHeightRatio: this.maxHeightRatio,
            height: (this.workBookPage.dimensions.height * this.maxWidthRatio),
            width: (this.workBookPage.dimensions.width * this.maxWidthRatio),
            zoom: this.maxWidthRatio,
            pixelRatio: window.devicePixelRatio,
          };
        }
        this.$store.commit('workBook/setCurrentPageDimensions', dimensions);
      }
    },

    setZoom(dir: string) {
      let newZoom = this.pageDimensions.zoom;
      if (dir === 'inc' && this.maxWidthRatio) {
        if (this.pageDimensions.zoom < (this.maxWidthRatio - 0.1)) {
          newZoom = this.pageDimensions.zoom + 0.1;
        } else if (this.pageDimensions.zoom < this.maxWidthRatio) {
          newZoom = this.maxWidthRatio;
        }
      } else {
        if (this.pageDimensions.zoom > (this.maxHeightRatio + 0.1)) {
          newZoom = this.pageDimensions.zoom - 0.1;
        } else if (this.pageDimensions.zoom > this.maxHeightRatio) {
          newZoom = this.maxHeightRatio;
        }
      }
      if (newZoom !== this.pageDimensions.zoom) {
        /** Only reset if changed */
        const dimensions = {
          height: (this.workBookPage.dimensions.height * newZoom),
          width: (this.workBookPage.dimensions.width * newZoom),
          zoom: newZoom,
        };
        this.$store.commit('workBook/setCurrentPageDimensions', dimensions);
      }
      this.$store.commit('workBook/setToolAction', null);
    },
  },
  watch: {
     workBookPage: {
      handler(newPage, oldPage) {
        if (this.workBookPage
        && ((!this.pageDimensions && this.workBookPage.dimensions)
        || (oldPage && oldPage.dimensions.height !== newPage.dimensions.height)
        || (oldPage && oldPage.dimensions.width !== newPage.dimensions.width))) {
          this.setDefaultZoom();
        }
      },
      deep: true,
    },
    toolAction: {
      handler(newAction, oldAction) {
        if (this.toolAction === 'zoomIn') {
          this.setZoom('inc');
        }
        if (this.toolAction === 'zoomOut') {
          this.setZoom('dec');
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
.page-wrapper {
  max-width: calc(100vw - 20px);
  flex-grow: 2;
  height: calc(100vh - 100px);
  height: calc((var(--vh, 1vh) * 100) - 100px);
  justify-content: center;
  display: flex;
  overflow: auto;
  position: relative;
  .page {
    position: relative;
  }
}
</style>
