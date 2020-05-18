<template>
  <div class="page-wrapper" ref="page">
    <!-- PAGE TEXT EDITOR -->
    <template v-if="pageDimensions">
      <div

        class="text-toolbar-wrapper"
        :style="{width: (pageDimensions.maxWidth) + 'px', left: '15px'}">
      </div>
    </template>
    <!-- PAGE SETUP -->
    <page-setup></page-setup>
    <!-- DOWNLOAD -->
    <download></download>
    <!-- PAGE WRAPPER -->
    <div
      v-if="pageDimensions"
      class="page"
      :style="{width: pageDimensions.width+'px', height: pageDimensions.height+'px'}">
      <!-- PDF -->
      <view-pdf>
      </view-pdf>
      <!-- TEXT -->
      <div
        v-if="pageDimensions"
        :style="{
        transform: 'scale(' + pageDimensions.zoom + ')',
        transformOrigin: 'top left',
        top: (35 * pageDimensions.zoom) + 'px',
        height: (workBookPage.dimensions.height - 35)+'px',
        width: workBookPage.dimensions.width+'px',
        pointerEvents: textLayerActive ? 'all' : 'none',
        userSelect: 'none'}"
        class="text-layer"
        @click="addTextBlock">
        <template v-for="(textLayer, index) in workBookPage.textLayers">
          <text-editor
            v-if="textLayer.width"
            :key="index"
            :print="false"
            :zoom="pageDimensions.zoom"
            :pageWidth="workBookPage.dimensions.width"
            :pageHeight="workBookPage.dimensions.height"
            :textLayerIndex="index"
            >
          </text-editor>
        </template>
      </div>
      <!-- DRAWING -->
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
import TextEditor from '@/components/editor/page/TextEditor.vue';
import DrawingCanvas from '@/components/editor/page/DrawingCanvas.vue';
import PageSetup from '@/components/editor/page/PageSetup.vue';


/* Utils */
import { appStrings } from '@/utils';
import { IWorkBookPageDimensions, toolActionEnum, modesEnum } from '@/types';

export default Vue.extend({
  name: 'Page',
  components: { ViewPdf, DrawingCanvas, PageSetup, Download, TextEditor },
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
      modes: 'workBook/getModes',
      settings: 'workBook/getSettings',
    }),
    textLayerActive() {
      return this.modes.mode === modesEnum.TEXT; // && this.modes.subMode === 'text'
    },
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

    addTextBlock(e: any) {
      if (e
        && e.target
        && e.clientX
        && e.clientY
        && e.target.classList.contains('text-layer')
        // && (!e.target.firstChild || e.target.firstChild.classList.contains('vdr'))
      ) {
        if (this.settings.activeEditor === null) {
          const rect: any = e.target.getBoundingClientRect();
          const x = (e.clientX - 0) - rect.left; // x position within the element.
          const y = (e.clientY - 5) - rect.top;  // y position within the element.
          const payload = {
            workBookKey: this.workBook.id,
            pageKey: this.workBookPage.id,
            index: this.workBookPage.textLayers.length,
            textLayer:  {
              commit: 0,
              text: '',
              x: x / this.pageDimensions.zoom,
              y: y / this.pageDimensions.zoom,
              width: 'auto',
              height: 'auto',
              borderWidth: 0,
              borderColor: '#000000',
              opacity: 1,
              backgroundColor: '#ffffff',
            },
          };
          this.$store.dispatch('workBook/updatePageText', payload);
        } else {
          {
            const settingsPayload = {
              activeEditor: null,
            };
            this.$store.commit('workBook/setSettings', settingsPayload);
          }
        }
      }
    },

    deleteTextBlock() {
      const payload = {
        user: this.user,
        storyKey: this.workBook.id,
        pageKey: this.workBookPage.id,
        index: this.settings.activeEditor,
        textLayer:  null,
      };
      this.$store.dispatch('workBook/updatePageText', payload);
      this.$store.commit('setToolAction', null);
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
    .text-layer {
      position: absolute;
      z-index: 3;
      top: 40px;
      left: 0;
      transform-origin: top left;
    }
  }
}

.text-toolbar-wrapper {
  position: fixed;
  top: 45px;
  left: 110px;
  width: 100%;
  z-index: 101;
  display: flex;
  justify-content: center;
  .tox-collection__item-label * {
    line-height: 1em;
  }
}
</style>
