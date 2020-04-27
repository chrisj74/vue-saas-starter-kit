<template>
  <div
  class="drawing-canvas-wrapper"
  :class="{inactive: modes.mode !== modesEnum.DRAW}"
  :style="{cursor: modes.mode === modesEnum.DRAW ? 'url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAxElEQVQoU1WPMWqEUBCGv0EL3z1S7AmWNF5AJJU2KQTfBazSBcF2t0mTVhBLYSG4J1gsFoTXLjlFWkkUw8AW63Q/3zf/MAKwrusbYJdl2Xme9wdcgaOI9KLQOXcoioJhGDDGkKYpTdPo7l6FWxiGO4WPU1UVZVl+yDzPq+/7G6ghjmP6vj9rw2yM8aZp2khJktB13UmFS5ZlYdu2G6Gua/I8f1fhBfjSm+M4EgQBURRhrf0GnuX+5h54BZ6AX8ABnyLy8w9lUFCmj9QjewAAAABJRU5ErkJggg==&quot;) 3 3, auto' : 'default'}">
    <canvas
      id="drawing-canvas"
      v-if="pageDimensions"
      :style="{
        width: pageDimensions.width + 'px',
        height: pageDimensions.height + 'px',
        top: 0,
        left: 0,
      }"
    >

    </canvas>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import { uuid } from 'uuidv4';
import SignaturePad from 'signature_pad';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { IWorkBook, IWorkBookPage, IUpdateWorkBookPage, modesEnum } from '@/types';

export default Vue.extend({
  name: 'DrawingCanvas',
  components: {  },
  data() {
    return {
      appStrings,
      modesEnum,

      drawingCanvas: null,
      drawingPad: null,
      ctx: null,
      pen: {
        penColor: '#000000',
        penWidth: 4,
      },
      dataCache: null,
    };
  },
  created() {
    // Created
  },
  mounted() {
    const vm = this;
    window.addEventListener('resize', function(event) {
      vm.resizeCanvas();
    });

    if (!this.drawingPad && this.pageDimensions) {
      this.initCanvas();
    }
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookPage: 'workBook/getWorkBookPage',
      modes: 'workBook/getModes',
      pageDimensions: 'workBook/getCurrentPageDimensions',
      settings: 'workBook/getSettings',
    }),
  },
  methods: {
    initCanvas() {
      const vm = this;
      this.drawingCanvas = document.querySelector('#drawing-canvas');
      this.drawingPad = new SignaturePad(this.drawingCanvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: vm.settings.color,
        maxWidth: vm.settings.brushWidth * vm.pageDimensions.zoom,
        minDistance: 1,
        dotSize: vm.getDotSize(),
        throttle: 16,
        onBegin() {
          const payload = {
            showBrushWidth: false,
          };
          // vm.$store.commit('setSettings', payload);
        },
        onEnd() {
          vm.dataCache = this.toDataURL('image/png', 1);
          vm.savePage();
        },
      });
      this.resizeCanvas();
    },

    getDotSize() {
      const minDot = 1 * this.pageDimensions.zoom;
      const dotSize = (this.settings.brushWidth * this.pageDimensions.zoom) * 0.6;
      return dotSize > minDot ? dotSize : minDot;
    },

    resizeCanvas() {
      const ratio =  Math.max(window.devicePixelRatio || 1, 1);
      this.ctx = this.drawingCanvas.getContext('2d');
      this.drawingCanvas.width = this.pageDimensions.width * ratio;
      this.drawingCanvas.height = this.pageDimensions.height  * ratio;
      if (this.workBookPage.drawingLayer.drawingCanvasImage) {
        this.drawingPad.fromDataURL(this.workBookPage.drawingLayer.drawingCanvasImage);
      }
      this.dataCache = this.workBookPage.drawingLayer.drawingCanvasImage;

      this.ctx.scale(ratio, ratio);
    },

    clearDrawing() {
      this.drawingPad.clear();
      this.dataCache = this.drawingPad.toDataURL('image/png', 1);
      this.savePage();
      this.$store.commit('setToolAction', null);
    },

    savePage() {
      if (this.workBookPage) {
        const payload: IUpdateWorkBookPage = {
          workBookId: this.workBook.id,
          workbookPageId: this.workBookPage.id,
          page: {
            drawingLayer: {
              drawingCanvasImage: this.dataCache,
              penWidth: this.pen.penWidth,
              penColor: this.pen.penColor,
            },
          },
        };
        this.$store.dispatch('workBook/updateWorkBookPage', payload);
      }
    },
  },
  watch: {
    $route: {
      handler(from, to) {
        if (
          (from.params.workBookId === to.params.workBookId &&
            from.params.pageId !== to.params.pageId) ||
          !to.params.pageId
        ) {
          if (!this.drawingPad) {
            this.initCanvas();
          } else {
            this.drawingPad.clear();
          }
        }
      },
      deep: true,
    },
    workBookPage: {
      handler(newPage, oldPage) {
        if (!this.drawingPad && this.pageDimensions) {
          this.initCanvas();
        } else if (newPage.drawingLayer && (newPage.drawingLayer.drawingCanvasImage !== this.dataCache)) {
          this.resizeCanvas();
        }
      },
      deep: true,
    },
    settings: {
      handler(newSettings, oldSettings) {
        if (this.settings.brushWidth * this.pageDimensions.zoom !== this.drawingPad.maxWidth) {
          this.drawingPad.maxWidth = this.settings.brushWidth * this.pageDimensions.zoom;
          this.drawingPad.dotSize = this.getDotSize();
        }
        if (this.settings.color !== this.drawingPad.penColor) {
          this.drawingPad.penColor = this.settings.color;
        }
      },
      deep: true,
    },
    pageDimensions: {
      handler(newDimensions, oldDimensions) {
        if (this.settings.brushWidth * this.pageDimensions.zoom !== this.drawingPad.maxWidth) {
          this.drawingPad.maxWidth = this.settings.brushWidth * this.pageDimensions.zoom;
          this.drawingPad.dotSize = this.getDotSize();
        }
        if (newDimensions.zoom !== oldDimensions.zoom) {
          this.resizeCanvas();
        }
      },
      deep: true,
    },
    modes: {
      handler(newMode, oldMode) {
        let ctx: any;
        if (this.modes.subMode === 'eraser' && this.drawingCanvas) {
          ctx = this.drawingCanvas.getContext('2d');
          ctx.globalCompositeOperation = 'destination-out';
        } else if (this.modes.subMode === 'brush' && this.drawingCanvas) {
          ctx = this.drawingCanvas.getContext('2d');
          ctx.globalCompositeOperation = 'source-over';
        }
      },
      deep: true,
    },
    toolAction: {
      handler(newAction, oldAction) {
        if (this.toolAction === 'clearDrawing') {
          this.clearDrawing();
        }
      },
    },
  },
});
</script>

<style lang="scss">
.drawing-canvas-wrapper {
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
#drawing-canvas {
  position: absolute;
  z-index: 4;
  border: solid 1px #ddd;
}
.inactive {
  pointer-events: none;
}
</style>
