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
import { IWorkBook, IWorkBookPage, IUpdateWorkBookPage, modesEnum, toolActionEnum, subModesEnum } from '@/types';

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
      toolAction: 'workBook/getToolAction',
    }),
  },
  methods: {
    initCanvas() {
      this.setCssColor();
      const vm = this;
      this.drawingCanvas = document.querySelector('#drawing-canvas');
      this.drawingPad = new SignaturePad(this.drawingCanvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: vm.getColor(),
        maxWidth: vm.settings.brushWidth * vm.pageDimensions.zoom,
        minWidth: 0.5,
        minDistance: 1,
        dotSize: vm.getDotSize(),
        throttle: 16,
        onBegin() {
          if (vm.settings.showDrawingExtras) {
            const payload: any = {
              showDrawingExtras: false,
            };
            vm.$store.commit('workBook/setSettings', payload);
          }
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
      console.log('resize canvas', this.workBookPage.drawingLayer);
      const ratio =  Math.max(window.devicePixelRatio || 1, 1);
      this.ctx = this.drawingCanvas.getContext('2d');
      this.drawingCanvas.width = this.pageDimensions.width * ratio;
      this.drawingCanvas.height = this.pageDimensions.height  * ratio;
      this.ctx.scale(ratio, ratio);
      if (this.workBookPage.drawingLayer.drawingCanvasImage) {
        this.drawingPad.fromDataURL(this.workBookPage.drawingLayer.drawingCanvasImage);
        this.dataCache = this.workBookPage.drawingLayer.drawingCanvasImage;
      }
    },

    clearDrawing() {
      this.drawingPad.clear();
      this.dataCache = this.drawingPad.toDataURL('image/png', 1);
      this.savePage();
      this.$store.commit('workBook/setToolAction', null);
    },

    getColor() {
      /* convert opcity to hex */
      let hexOpacity = (Math.round(this.settings.brushOpacity * 255)).toString(16);
      while (hexOpacity.length < 2) {
        hexOpacity = '0' + hexOpacity;
      }
      /* manipulate color to include opacity */
      return this.settings.color.substring(0, 7) + hexOpacity;
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

    setCssColor() {
      const root = document.documentElement;
      root.style.setProperty('--tool-color', this.getColor());
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
            this.resizeCanvas();
          }
        }
      },
      deep: true,
    },
    workBookPage: {
      handler(newPage, oldPage) {
        if (!this.drawingPad && this.pageDimensions) {
          this.initCanvas();
        } else if (this.workBookPage && this.workBookPage.drawingLayer) {
          if (this.workBookPage.drawingLayer.drawingCanvasImage !== this.dataCache) {
            this.resizeCanvas();
          }
        }
      },
      deep: true,
    },
    settings: {
      handler(newSettings, oldSettings) {
        if (this.settings.brushWidth * this.pageDimensions.zoom !== this.drawingPad.maxWidth) {
          this.drawingPad.maxWidth = this.settings.brushWidth * this.pageDimensions.zoom;
          this.drawingPad.dotSize = this.getDotSize();
          if (this.modes.subMode === subModesEnum.INK) {
            this.drawingPad.minWidth = 0.5;
          } else if (this.modes.subMode === subModesEnum.MARKER
            || this.modes.subMode === subModesEnum.ERASER
            || this.modes.subMode === subModesEnum.HIGHLIGHTER) {
            this.drawingPad.minWidth = this.settings.brushWidth * this.pageDimensions.zoom;
          }
        }
        if (this.getColor() !== this.drawingPad.penColor) {
          this.setCssColor();
          this.drawingPad.penColor = this.getColor();
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
        if (this.modes.mode === modesEnum.DRAW) {
          /* RESET COLOR IF NOT HIGHLIGHTER */
          if (oldMode
            && oldMode.subMode !== newMode.subMode
            && oldMode.subMode === subModesEnum.HIGHLIGHTER
          ) {
            const payload: any = {
              color: '#000000',
              brushOpacity: 1,
              brushWidth: 2,
            };
            this.$store.commit('workBook/setSettings', payload);
          }

          /* SUBMODE SPECIFIC SETTINGS */
          if (this.modes.subMode === subModesEnum.ERASER && this.drawingCanvas) {
            ctx = this.drawingCanvas.getContext('2d');
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            /* Increase brush size */
            this.drawingPad.maxWidth = (this.settings.brushWidth * 2) * this.pageDimensions.zoom;
            this.drawingPad.minWidth = (this.settings.brushWidth * 2) * this.pageDimensions.zoom;
            this.drawingPad.dotSize = this.getDotSize();
          } else if (this.modes.subMode === subModesEnum.INK && this.drawingCanvas) {
            ctx = this.drawingCanvas.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            /* Reset brush size */
            this.drawingPad.maxWidth = this.settings.brushWidth * this.pageDimensions.zoom;
            this.drawingPad.minWidth = 0.5;
            this.drawingPad.dotSize = this.getDotSize();
          } else if (this.modes.subMode === subModesEnum.MARKER && this.drawingCanvas) {
            ctx = this.drawingCanvas.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            /* Reset brush size */
            this.drawingPad.maxWidth = this.settings.brushWidth * this.pageDimensions.zoom;
            this.drawingPad.minWidth = this.settings.brushWidth * this.pageDimensions.zoom;
            this.drawingPad.dotSize = this.getDotSize();
          } else if (this.modes.subMode === subModesEnum.HIGHLIGHTER && this.drawingCanvas) {
            ctx = this.drawingCanvas.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.2;
            /* Reset brush size */
            this.drawingPad.maxWidth = this.settings.brushWidth * this.pageDimensions.zoom;
            this.drawingPad.minWidth = this.settings.brushWidth * this.pageDimensions.zoom;
            this.drawingPad.dotSize = this.getDotSize();
            const payload: any = {
              color: '#41b906',
              brushOpacity: 0.05,
              brushWidth: 15,
            };
            this.$store.commit('workBook/setSettings', payload);
          }
        }
      },
      deep: true,
    },
    toolAction: {
      handler(newAction, oldAction) {
        if (this.toolAction === toolActionEnum.CLEAR_DRAWING) {
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
