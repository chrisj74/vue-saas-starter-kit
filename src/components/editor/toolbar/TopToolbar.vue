<template>
  <div class="tools-wrapper" v-if="modes">
    <div class="tools-icons-wrapper">
      <!-- TYPING -->
      <div
        class="svg-icon-wrapper"
        @click="setText()"
        :class="{'active-tool': modes.mode === modesEnum.TEXT && modes.subMode === subModesEnum.TYPE}">
        <svg class="svg-icon-tool svg-icon-text" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
          <rect id="Rounded_Rectangle_1" data-name="Rounded Rectangle 1" class="cls-1" x="2" y="2" width="96" height="96" rx="15" ry="15"/>
          <text id="T" class="cls-2" x="49.699" y="74.477"><tspan x="49.699">T</tspan></text>
        </svg>
      </div>
      <!-- INK PEN -->
      <div
        class="svg-icon-wrapper"
        @click="setInk()"
        :class="{'active-tool': modes.mode === modesEnum.DRAW && modes.subMode === subModesEnum.INK}">
        <svg id="inkpen-svg" viewBox="0 0 100 32" class="svg-icon-tool svg-icon-ink rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd">
            <path class="inkpen-accent" d="M48 5L4 4v23.965L48 27z"></path>
            <path class="inkpen-shadow" d="M4 21.224V28l43.61-1.002v-5.774z"></path>
            <path class="inkpen-nib" d="M76.097 24.8c.22-.041.443-.09.667-.143.12-.028.24-.06.36-.091.09-.024.179-.046.27-.071.176-.049.354-.1.532-.155l.02-.007c2.697-.827 5.492-2.294 8.048-3.81l.04-.023h-.002c.69-.41 1.363-.821 2.011-1.225C91.657 17.024 95 16.384 95 16.384V16H56.012v4.164a.194.194 0 0 0-.012-.002v2.387l8.388 1.278c.532.054 1.063.116 1.593.184l.168.022a61.717 61.717 0 0 1 2.935.454c1.256.227 2.753.47 4.28.507.915.024 1.841-.025 2.733-.193M95 14.685s-3.344-.708-6.959-2.96c-1.466-.912-3.056-1.868-4.692-2.734-2.4-1.27-4.9-2.345-7.258-2.791-2.377-.45-4.999-.05-7.003.313a61.885 61.885 0 0 1-4.697.66L56 8.451V15h39v-.315zM51 5l-4.483-.036C46.184 8.328 46 12.201 46 16.093c0 3.893.184 7.579.517 10.944L51 27V5z">
            </path>
            <path class="inkpen-channel" d="M75.114 13.297a2.25 2.25 0 1 1-.001 4.5 2.25 2.25 0 0 1 .001-4.5">
            </path>
            <path class="inkpen-channel" d="M56 15v1h39v-1z"></path>
            <path class="inkpen-section" d="M54 27.204V4.796c0-.44-.435-.796-.97-.796h-1.06c-.535 0-.97.356-.97.796v22.408c0 .44.435.796.97.796h1.06c.535 0 .97-.357.97-.796">
            </path>
            <path class="inkpen-collar" d="M54 15.747V27l1.688-1.394a.827.827 0 0 0 .298-.638V21.55l.014-.018v-.061l-.014-1.513v-.13c.005-.007.01-.013.014-.021v-3.134l-.014-1.74-.001.002-.012-2.368s.006-5.702-.006-5.76a.825.825 0 0 0-.279-.413L54 5v10.747zM95 14.536c.552 0 1 .453 1 1.012 0 .559-.448 1.012-1 1.012s-1-.453-1-1.012c0-.56.448-1.012 1-1.012">
            </path>
          </g>
        </svg>
      </div>
      <!-- MARKER PEN -->
      <div
        class="svg-icon-wrapper"
        @click="setMarker()"
        :class="{'active-tool': modes.mode === modesEnum.DRAW && modes.subMode === subModesEnum.MARKER}">
        <svg id="marker-svg" viewBox="0 0 100 32" class="svg-icon-tool svg-icon-marker rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd">
            <path class="marker-dark-handle" d="M58.903 29.146l-.04-.232a56.35 56.35 0 0 1-.096-.584l-.04-.256a75.309 75.309 0 0 1-.123-.845 55.045 55.045 0 0 1-.113-.865c-.154-1.237-.28-1.984-.376-3.364H4v6.953h54.766c.095 0 .188-.014.28-.035-.05-.252-.097-.51-.143-.772z">
            </path>
            <path class="marker-light-handle" d="M58.125 9.531a87.665 87.665 0 0 0-.21 4.744l-.003.231a96.894 96.894 0 0 0 0 3.059l.003.234c.009.494.021.983.037 1.466l.006.14c.036 1.036.089 2.617.157 3.595H4V2h54.766c.105 0 .208.018.308.044-.05.251-.098.51-.145.772l-.04.232c-.033.191-.066.384-.098.58l-.042.268a72.302 72.302 0 0 0-.126.849l-.09.663-.026.205c-.034.27-.066.543-.098.82l-.009.076a75.61 75.61 0 0 0-.275 3.022z">
            </path>
            <path class="marker-tip" d="M89.184 19.626c1.021 0 2.03-.216 2.95-.633l4.1-1.857a1.24 1.24 0 0 0 0-2.292l-4.101-1.858a7.135 7.135 0 0 0-2.95-.616H84.61v7.256h4.575z">
            </path>
            <path class="marker-socket" d="M68.087 23h14.759a.62.62 0 0 0 .269-.062l1.519-1.298a.635.635 0 0 0 .352-.658 30.162 30.162 0 0 1-.138-1.356 46.8 46.8 0 0 1-.149-3.65c0-1.147.052-2.45.147-3.623.04-.487.086-.953.14-1.374a.636.636 0 0 0-.352-.658l-1.52-1.259a.625.625 0 0 0-.268-.06H68.087l-8.492-6.687a1.252 1.252 0 0 0-.52-.271c-.05.25-.099.51-.146.772l-.04.232c-.033.191-.066.383-.098.58l-.042.268a60.752 60.752 0 0 0-.215 1.512l-.027.205a76.112 76.112 0 0 0-.382 3.918 88.432 88.432 0 0 0-.21 4.744l-.003.231a96.943 96.943 0 0 0-.001 3.059l.004.234c.009.494.021.983.038 1.466l.005.14c.036 1.036.089 2.046.157 3.025a74.052 74.052 0 0 0 .49 4.799l.032.236.09.61.04.255c.032.198.064.392.097.584l.039.232c.046.262.093.52.142.772.202-.047.392-.14.55-.28L68.087 23z">
            </path>
            <path class="marker-accent" d="M95.88 16.433s-3.223 1.645-3.863 1.902c-.661.266-1.14.563-2.765.616-1.625.053-3.367-.015-3.367-.015s-.394-.07-.394-.389c0-.318.485-.392.485-.392l3.633.047s.877-.03 1.282-.214l4.81-1.992s.242-.082.327.133c.073.184-.148.304-.148.304">
            </path>
          </g>
        </svg>
      </div>
      <!-- HIGHLIGHTER -->
      <div
        class="svg-icon-wrapper"
        @click="setHighlighter()"
        :class="{'active-tool': modes.mode === modesEnum.DRAW && modes.subMode === subModesEnum.HIGHLIGHTER}">
        <svg class="svg-icon-tool svg-icon-highlighter" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 100">
          <path class="cls-1" d="M18.853,93.435l0.82,0.821h1.366l9.016-3.282,0.273-.273V79.485H18.853v13.95Z"/>
          <path class="cls-2" d="M17.413,76.438C16.852,55.38,4.908,41.793,2.732,38.455a7.268,7.268,0,0,0-1.639-.273l-0.82-.547V36.267H49.727l-0.273,1.368-0.273.547H47.541C47.535,35.459,32.472,58.39,32.5,72.782L32.24,77.023v2.462H17.486Z"/>
          <path class="cls-1" d="M0.273,36.267H49.727V-132.5H0.273V36.267Z"/>
          <path class="cls-3" d="M0.273,36.267H11.2V-132.5H0.273V36.267Z"/>
        </svg>
      </div>
      <!-- ERASER -->
      <div
        class="svg-icon-wrapper"
        @click="setEraser()"
        :class="{'active-tool': modes.mode === modesEnum.DRAW && modes.subMode === subModesEnum.ERASER}">
        <svg id="eraser-svg" viewBox="0 0 100 32" class="svg-icon-tool svg-icon-eraser rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd">
            <path class="eraser-tip eraser-shadow" d="M91.256 19.824h-15.39A158.925 158.925 0 0 1 75.5 27.5h16.593c2.394 0 4.407-5.58 4.407-12.463 0-1.603-.077-3.13-.211-4.537-.703 5.36-3.075 9.324-5.033 9.324">
            </path>
            <path class="eraser-tip" d="M91.175 21.5c2.07 0 4.582-4.136 5.325-9.73-.47-4.838-1.906-8.27-4.44-8.27H74.5c.284 3.811.448 8.256.448 13.005 0 1.71-.021 3.38-.061 4.995h16.288z">
            </path>
            <path class="eraser-handle" d="M3.5 3.5v24h76v-24z"></path>
            <path class="eraser-shadow" d="M52 27.5H3.5v-6h76v6H52z"></path>
            <path class="eraser-ferrule" d="M71.3 27.5s.497-3.903.497-12-.497-12-.497-12M67.7 27.5s.497-3.903.497-12-.497-12-.497-12M64.003 27.5s.497-3.903.497-12-.497-12-.497-12M60.003 27.5s.497-3.903.497-12-.497-12-.497-12" stroke-width=".817" stroke-linecap="round" stroke-linejoin="round">
            </path>
          </g>
        </svg>
      </div>
      <!-- DRAWING SUB TOOLS -->
      <div class="sub-tool-wrapper" v-if="modes.mode === modesEnum.DRAW">
        <div
        class="extra-tools-btn"
          @click="toggleDrawingExtras()"
          >
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="svg-icon">
            <path class="tool-option-button-light-body" d="M12.78,7.66,10.35,5.22,4,11.56V14H6.44Zm2.09-2.1a.42.42,0,0,0,0-.6L13,3.13a.42.42,0,0,0-.6,0L11.29,4.28l2.44,2.44Z">
            </path>
            <polygon class="tool-option-button-stroke-color" points="17 13 17 17 3 17 17 13"></polygon>
            <path class="tool-option-button-stroke-outline" d="M3,17L17,13L17,16L16,16L16,14.34L10.18,16L17,16L17,17z">
            </path>
            <path class="tool-option-button-dark-body" d="M12.78,7.66,11.56,6.44,4,14H6.44Zm2.09-2.1a.42.42,0,0,0,0-.6L14,4,12.51,5.49l1.22,1.22Z">
            </path>
          </svg>
        </div>
        <!-- COLOR -->
        <swatches
          :value="settings.color"
          @input="updateColor"
          swatches="text-advanced"
          show-fallback
          fallback-input-type="color"
          :popover-to="'bottom'"
          :trigger-style="{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px #000' }"
          v-if="(modes.mode === modesEnum.DRAW)"
          @open="resetDrawingExtras()">
        </swatches>

        <!-- CLEAR -->
        <v-btn
          icon
          small
          light
          @click="setClearCanvas()"
          >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card
          v-if="settings.showDrawingExtras"
          class="sub-tool-details-wrapper">
          <v-card-text>
            <div class="pl-0">Size</div>
            <v-slider
              :value="settings.brushWidth"
              thumb-label
              min="1"
              max="20"
              @end="changeWidth"
            ></v-slider>

            <div class="pl-0">Opacity</div>
            <v-slider
              :value="settings.brushOpacity"
              thumb-label
              min="0"
              max="1"
              step="0.1"
              @end="changeOpacity"
            ></v-slider>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-spacer />

    <div class="v-btn-toggle v-item-group">
      <v-btn
        icon
        small
        light
        :disabled="!pageDimensions || pageDimensions.zoom <= pageDimensions.maxHeightRatio"
        @click="setZoomOut()"
        >
        <v-icon>mdi-magnify-minus</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        light
        :disabled="!pageDimensions || pageDimensions.zoom >= pageDimensions.maxWidthRatio"
        @click="setZoomIn()"
        >
        <v-icon>mdi-magnify-plus</v-icon>
      </v-btn>
    </div>
    <v-btn
      icon
      small
      light
      @click.stop="setDownload()"
      >
      <v-icon>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import Swatches from 'vue-swatches';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { modesEnum, subModesEnum, toolActionEnum } from '@/types';

export default Vue.extend({
  name: 'TopToolbar',
  components: { Swatches },
  data() {
    return {
      appStrings,
      modesEnum,
      subModesEnum,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      pages: 'workBook/getWorkBookPages',
      pageDimensions: 'workBook/getCurrentPageDimensions',
      modes: 'workBook/getModes',
      settings: 'workBook/getSettings',
    }),
  },
  methods: {
    changeWidth(data: any) {
      const payload: any =  {
        brushWidth: data,
      };
      this.$store.commit('workBook/setSettings', payload);
    },

    changeOpacity(data: any) {
      const payload: any =  {
        brushOpacity: data,
      };
      this.$store.commit('workBook/setSettings', payload);
    },

    updateColor(newColor: string) {
      const payload = {
        color: newColor,
      };
      this.$store.commit('workBook/setSettings', payload);
    },

    toggleDrawingExtras() {
      console.log('toggle', this.settings);
      const payload: any = {
        showDrawingExtras: !this.settings.showDrawingExtras,
      };
      this.$store.commit('workBook/setSettings', payload);
    },

    resetDrawingExtras() {
      const payload: any = {
        showDrawingExtras: false,
      };
      this.$store.commit('workBook/setSettings', payload);
    },

    setZoomIn() {
      this.$store.commit('workBook/setToolAction', toolActionEnum.ZOOM_IN);
      this.resetDrawingExtras();
    },

    setZoomOut() {
      this.$store.commit('workBook/setToolAction', toolActionEnum.ZOOM_OUT);
      this.resetDrawingExtras();
    },

    setInk() {
      this.$store.commit('workBook/setMode', modesEnum.DRAW);
      this.$store.commit('workBook/setSubMode', subModesEnum.INK);
      this.resetDrawingExtras();
    },

    setMarker() {
      this.$store.commit('workBook/setMode', modesEnum.DRAW);
      this.$store.commit('workBook/setSubMode', subModesEnum.MARKER);
      this.resetDrawingExtras();
    },

    setHighlighter() {
      this.$store.commit('workBook/setMode', modesEnum.DRAW);
      this.$store.commit('workBook/setSubMode', subModesEnum.HIGHLIGHTER);
      this.resetDrawingExtras();
    },

    setEraser() {
      this.$store.commit('workBook/setMode', modesEnum.DRAW);
      this.$store.commit('workBook/setSubMode', subModesEnum.ERASER);
      this.resetDrawingExtras();
    },

    setText() {
      this.$store.commit('workBook/setMode', modesEnum.TEXT);
      this.$store.commit('workBook/setSubMode', subModesEnum.TYPE);
      this.resetDrawingExtras();
    },

    setClearCanvas() {
      this.$store.commit('workBook/setToolAction', toolActionEnum.CLEAR_DRAWING);
      this.resetDrawingExtras();
    },

    setDownload() {
      const payload = {
        export: true,
      };
      this.$store.commit('workBook/setDialogs', payload);
      this.resetDrawingExtras();
    },
  },
});
</script>

<style lang="scss">
/* @import '/node_modules/vue-swatches/dist/vue-swatches.min.css'; */
.vue-swatches__check__wrapper{position:absolute;width:100%;height:100%}.vue-swatches__check__circle{width:21px;height:21px;border-radius:50%;background-color:rgba(0,0,0,.15)}.vue-swatches__check__path{fill:#fff}.vue-swatches__swatch{position:relative;display:inline-block;font-size:0}.vue-swatches__swatch:focus,.vue-swatches__swatch:hover{opacity:.9;box-shadow:inset 0 0 2px rgba(0,0,0,.75);outline:none}.vue-swatches__swatch.vue-swatches__swatch--border,.vue-swatches__swatch.vue-swatches__swatch--selected{box-shadow:inset 0 0 2px rgba(0,0,0,.75)}.vue-swatches__swatch__label{position:absolute;left:0;right:0;color:#666;font-size:10px;font-weight:700;text-align:center}.vue-swatches__swatch .vue-swatches__diagonal__wrapper{position:absolute}fieldset[disabled] .vue-swatches{pointer-events:none}.vue-swatches{position:relative;display:inline-block;outline:none}.vue-swatches__trigger__wrapper{display:inline-block;cursor:pointer}.vue-swatches__trigger.vue-swatches--is-empty{border:2px solid #ccc}.vue-swatches__trigger.vue-swatches--is-disabled{cursor:not-allowed}.vue-swatches__container{margin-bottom:5px;box-sizing:content-box;padding:5px}.vue-swatches__container:not(.vue-swatches--inline){position:absolute;display:block;overflow:auto;border-radius:5px;box-shadow:0 2px 3px rgba(10,10,10,.2),0 0 0 1px rgba(10,10,10,.2);z-index:50}.vue-swatches__wrapper{background-color:inherit}.vue-swatches__row{font-size:0}.vue-swatches__fallback__wrapper{display:table}.vue-swatches__fallback__input--wrapper{display:table-cell;padding-right:10px;width:100%;font-size:14px}.vue-swatches__fallback__input{width:100%;padding-top:6px;padding-bottom:6px;border-radius:5px;border:1px solid #dcdcdc;color:#35495e;background:#fff}.vue-swatches__fallback__button{display:table-cell;padding:6px 15px;border:0;cursor:pointer;font-weight:700;color:#fff;background-color:#3571c8;border-radius:5px}.vue-swatches-show-hide-enter-active,.vue-swatches-show-hide-leave-active{transition:all .3s ease}.vue-swatches-show-hide-enter,.vue-swatches-show-hide-leave-active{opacity:0}.vue-swatches--has-children-centered{display:flex;align-items:center;justify-content:center}.vue-swatches__diagonal__wrapper{width:100%;height:100%}.vue-swatches__diagonal{width:75%;height:75%;background:linear-gradient(to top right,transparent 0,transparent calc(50% - 2.4px),#de080a 50%,transparent calc(50% + 2.4px),transparent)}
  .tools-wrapper {
    display: flex;
    flex-grow: 2;
    justify-content: center;
    .tools-icons-wrapper {
      display: flex;
      flex-grow: 2;
    }
    .sub-tool-wrapper {
      border-left: solid 1px #91959a;
      padding-left: 10px;
      margin-left: 10px;
    }
  }
  .svg-icon{
    width: 30px;
    height: 30px;
  }
  .svg-icon-wrapper {
    display: block;
    position: relative;
    top: -7px;
    transition: top 0.5s;
    width: 50px;
    height: 0px;
    cursor: pointer;
    &.active-tool {
      top: 5px;
        .svg-icon-tool{
        filter: drop-shadow(0 2px 4px #20212442);
      }
    }
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
  .svg-icon-ink, .svg-icon-marker, .svg-icon-eraser {
    position: absolute;
    left: -4px;
    bottom: -16px;
    width: calc(100px * 0.7);
    height: calc(32px * 0.7);
  }

  .svg-icon-highlighter {
    position: absolute;
    right: 0;
    top: -28px;
    height: calc(100px * 0.7);
    width: calc(50px * 0.7);
  }
  .svg-icon-text {
    width: 40px;
    height: 40px;
    position: absolute;
    top: -5px;
    right: 0;
  }

  .chalk-light-body, .eraser-tip.eraser-shadow, .eraser-handle, .marker-light-handle, .inkpen-accent, .pencil-light-handle, .tool-option-button-dark-body {
    fill: #b2b4b8;
  }
  .eraser-shadow, .inkpen-shadow, .inkpen-channel, .inkpen-section, .marker-dark-handle, .marker-tip, .pencil-tip, .pencil-dark-handle {
    fill: #91959a;
  }

  .chalk-dark-tip, .eraser-tip, .inkpen-nib, .inkpen-collar, .marker-socket, .pencil-collar, .tool-option-button-light-body {
    fill: #d6dadc;
  }

  .chalk-dark-accent, .marker-accent, .eraser-ferrule {
    fill: #71767c;
  }

  .tool-option-button-stroke-color, .active-tool .marker-tip, .active-tool .inkpen-channel, .active-tool .pencil-tip, :not(.dark-color) > .active-tool  .chalk-light-body, .active-tool .marker-light-handle, :not(.dark-color) > input:checked + label .pencil-light-handle, .dark-color > input:checked + label .chalk-dark-accent, .dark-color > input:checked + label .chalk-dark-tip, .dark-color > input:checked + label .marker-dark-handle, .dark-color > input:checked + label .pencil-dark-handle {
    fill: var(--tool-color);
  }
  .active-tool .eraser-tip {
    fill: #fce8e6;
  }

  .svg-icon-text {
    .cls-1 {
      fill: #ebebeb;
      stroke: #71767c;
      stroke-width: 4px;
    }

    .cls-2 {
      font-size: 70.833px;
      fill: #71767c;
      text-anchor: middle;
      font-family: "Arial";
      font-weight: 500;
    }
  }

  .svg-icon-highlighter {
    .cls-1 {
      fill: #d6dadc;
    }

    .cls-1, .cls-2, .cls-3 {
      fill-rule: evenodd;
    }

    .cls-2 {
      fill: #959595;
    }

    .cls-3 {
      fill: #91959a;
    }
  }

  .active-tool {
    .svg-icon-text {
      .cls-1 {
        stroke: #1c1d1d;
      }
      .cls-2 {
        fill: #1c1d1d;
      }
    }
    .svg-icon-highlighter {
      .cls-1 {
        fill: var(--tool-color);
      }
    }
  }

  /* SUB TOOLS */
  .sub-tool-wrapper {
    position: relative;
    display: flex;
    .sub-tool-details-wrapper {
      position: absolute;
      top: 40px;
      right: 0;
      width: 150px;
      max-width: 150px;
      background: #fff;
      border-radius: 10px;
      z-index: 10;
    }
  }
  .extra-tools-btn {
    margin-right: 10px;
    cursor: pointer;
  }

</style>