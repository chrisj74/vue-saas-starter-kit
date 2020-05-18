<template>
  <vue-draggable-resizable
    :prevent-deactivation="false"
    :w="layerWidth"
    :h="layerHeight"
    :x="workBookPage.textLayers[layerIndex].x"
    :y="workBookPage.textLayers[layerIndex].y"
    :scale="zoom"
    :drag-handle="'.drag-handle'"
    @dragstop="onDrag"
    @dragging="onDragging"
    :onResizeStart="startResize"
    :onResize="beforeResize"
    @resizestop="onResize"
    @deactivated="onEditorBlur"
    :parent="true"
    :active="active && settings.activeEditor === layerIndex"
    :class="{print: print, 'text-mode' : modes.mode === 'text'}"
    class="text-box"
    ref="dragWrapper"
    >
    <div
      class="text-outer-box"
      :style="{
        borderWidth: workBookPage.textLayers[layerIndex].borderWidth + 'px',
        borderColor: workBookPage.textLayers[layerIndex].borderColor,
        backgroundColor: backgroundColor,
        maxWidth: (workBookPage.dimensions.width - workBookPage.textLayers[layerIndex].x) + 'px',
        maxHeight: (workBookPage.dimensions.height - workBookPage.textLayers[layerIndex].y) + 'px'}"
      :class="{'inactive-editor' : layerIndex !== settings.activeEditor}"
      @click.stop="selectLayer()"
      ref="textWrapper">
      <tinymce-editor
        :key="workBookPage.id + '_text_' + layerIndex"
        v-model="editorContent"
        class="editor"
        v-if="editorConfig"
        api-key="p0igcqysw2jkny4v7wki9qyg6p05lplhpctohfurcbsjc7dp"
        :init="editorConfig"
        @onFocus="onEditorFocus"
        @onInit="onEditorReady"
        @onBlur="onEditorBlur">
      </tinymce-editor>

      <div v-else v-html="workBookPage.textLayers[layerIndex].text" class="text-render"></div>
    </div>
    <div class="drag-handle" v-if="active && layerIndex === settings.activeEditor" @click.stop="selectLayer()"></div>
  </vue-draggable-resizable>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import { uuid } from 'uuidv4';
import VueDraggableResizable from 'vue-draggable-resizable';
import Editor from '@tinymce/tinymce-vue';
import debounce from 'lodash/debounce';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { IWorkBook, IWorkBookPage, modesEnum } from '@/types';

export default Vue.extend({
  name: 'TextEditor',
  props: ['zoom', 'pageWidth', 'pageHeight', 'print', 'textLayerIndex'],
  components: {
    VueDraggableResizable,
    'tinymce-editor': Editor },
  data() {
    return {
      appStrings,
      pdfPath: null,
      currentPage: 0,
      pageCount: 0,
      editorConfig: null,
      layerIndex: this.textLayerIndex,
      active: false,
      editorContent: '',
      editor: null,
      editorCommits: 0,
      layerWidth: 'auto',
      layerHeight: 'auto',
    };
  },
  created() {
    // Created
  },
  mounted() {
    // Mounted
    if (this.modes && this.modes.mode === modesEnum.TEXT) {
      this.active = true;
    }

    if (this.workBookPage) {
      this.editorContent = this.workBookPage.textLayers[this.layerIndex].text;
      this.layerWidth = this.workBookPage.textLayers[this.layerIndex].width;
      this.layerHeight = this.workBookPage.textLayers[this.layerIndex].height;
      const payload = {
        activeEditor: this.layerIndex,
      };
      this.$store.commit('workBook/setSettings', payload);
    }

    this.editorConfig = {
      plugins: 'wordcount, table, media, emoticons, lists',
      inline: true,
      fixed_toolbar_container: '.text-toolbar-wrapper',
      menubar: false,
      draggable_modal: true,
      toolbar: ' alignleft aligncenter alignright | styleselect | bold italic emoticons | table media | bullist numlist | fontsizeselect fontselect | forecolor',
      toolbar_drawer: 'floating',
      font_formats: 'Handwriting=Schoolbell; Arial=arial,helvetica,sans-serif; Arial Black=arial black, sans-serif; Courier New=courier new,courier,monospace',
      fontsize_formats: '9px 11px 12px 14px 16px 18px 20px 24px 36px 48px 56px',
      contextmenu: 'inserttable | cell row column deletetable',
      mobile: {
        theme: 'mobile',
        plugins: 'lists, autolink',
        toolbar: 'undo, bold, italic, styleselect',
      },
    };
    // this.setMinDimensions();
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookPages: 'workBook/getWorkBookPages',
      workBookPage: 'workBook/getWorkBookPage',
      pageDimensions: 'workBook/getCurrentPageDimensions',
      modes: 'workBook/getModes',
      settings: 'workBook/getSettings',
    }),
    backgroundColor() {
      let bgColor = '#ffffff';
      if (this.workBookPage) {
        /* convert opcity to hex */
        let hexOpacity = (Math.round(this.workBookPage.textLayers[this.layerIndex].opacity * 255)).toString(16);
        while (hexOpacity.length < 2) {
          hexOpacity = '0' + hexOpacity;
        }
        bgColor = this.workBookPage.textLayers[this.layerIndex].backgroundColor;
        /* manipulate color to include opacity */
        bgColor = bgColor.substring(0, 7) + hexOpacity;
      }
      return bgColor;
    },
  },
  methods: {
    // Methods
    /* EDITOR MTHODS */
    selectLayer() {
      if (this.settings.activeEditor !== this.layerIndex)   {
        const payload = {
          activeEditor: this.layerIndex,
        };
        this.$store.commit('workBook/setSettings', payload);
      }
    },

    onEditorFocus(event: any, editor: any) {
      event.preventDefault();
      this.active = true;
      console.log('focus');
    },

    onEditorBlur(event: any) {
      console.log('blur text', this.workBookPage.textLayers[this.layerIndex].text);
      if (this.workBookPage.textLayers[this.layerIndex].text.length === 0) {
        /* Remove empty blocks */
        console.log('delete', this.workBookPage.textLayers[this.layerIndex]);
        const payload = {
            workBookKey: this.workBook.id,
            pageKey: this.workBookPage.id,
            index: this.layerIndex,
            textLayer: null,
        };
        this.$store.dispatch('workBook/updatePageText', payload);
      }
    },

    onEditorReady(event: any, editor: any) {
      this.editor = editor;
      this.contentSet = true;
      if (this.layerIndex === this.settings.activeEditor
        && !event.target.hasFocus() && this.modes.mode === modesEnum.TEXT) {
        editor.focus();
      }
    },

    updateText: debounce(function() {
      this.editorCommits++;
      const payload = {
        workBookKey: this.workBook.id,
        pageKey: this.workBookPage.id,
        index: this.layerIndex,
        textLayer: {
          commit: this.editorCommits,
          x: this.workBookPage.textLayers[this.layerIndex].x,
          y: this.workBookPage.textLayers[this.layerIndex].y,
          width: this.workBookPage.textLayers[this.layerIndex].width,
          height: this.workBookPage.textLayers[this.layerIndex].height,
          text: this.editorContent,
        },
      };
      this.$store.dispatch('workBook/updatePageText', payload);
    }, 1000),

    /* DRAG RESIZE METHODS */
    beforeResize() {
      console.log('BEFORE resize');
    },

    startResize() {
      console.log('START resize');
      if (this.layerWidth === 'auto') {
        // this.$refs.dragWrapper.width = this.$refs.textWrapper.clientWidth;
        // this.$refs.dragWrapper.height = this.$refs.textWrapper.clientHeight;
        // this.$refs.dragWrapper.right =
        //   (this.parentWidth - this.$refs.dragWrapper.left - this.$refs.dragWrapper.width);
        // this.$refs.dragWrapper.bottom =
        //   (this.$refs.dragWrapper.parentHeight - this.$refs.dragWrapper.top - this.$refs.dragWrapper.height);
        // this.layerWidth = this.$refs.dragWrapper.minW;
        // this.layerHeight = this.$refs.dragWrapper.minH;
        /* this.onResize(
          this.workBookPage.textLayers[this.layerIndex].x,
          this.workBookPage.textLayers[this.layerIndex].y,
          this.layerWidth,
          this.layerHeight,
        ); */
        console.log('top=', this.$refs.dragWrapper.top);
        console.log('height = ', this.$refs.dragWrapper.height);
        console.log(this.$refs.dragWrapper);
      }
    },

    setMinDimensions() {
      /* Stop vdr collapsing when starting resize on auto */
      if (this.workBookPage.textLayers[this.layerIndex].width === 'auto') {

        this.$refs.dragWrapper.minW = this.$refs.textWrapper.clientWidth + 5;
        this.$refs.dragWrapper.minH = this.$refs.textWrapper.clientHeight + 5;

        this.$refs.dragWrapper.width = this.$refs.textWrapper.clientWidth + 5;
        this.$refs.dragWrapper.height = this.$refs.textWrapper.clientHeight + 5;

        this.$refs.dragWrapper.right =
          (this.parentWidth - this.$refs.dragWrapper.left - this.$refs.dragWrapper.width);
        this.$refs.dragWrapper.bottom =
          (this.$refs.dragWrapper.parentHeight - this.$refs.dragWrapper.top - this.$refs.dragWrapper.height);

      } else {
        this.$refs.dragWrapper.minW = null;
        this.$refs.dragWrapper.minH = null;
      }
      console.log(this.$refs.dragWrapper);
    },

    onResize: debounce(function(x, y, width, height) {
      if (this.user) {
        const payload = {
            workBookKey: this.workBook.id,
            pageKey: this.workBookPage.id,
            index: this.layerIndex,
            textLayer: {
              commit: this.workBookPage.textLayers[this.layerIndex].commit + 1,
              x: x * this.pageDimensions.zoom,
              y: y * this.pageDimensions.zoom,
              width: width  * this.pageDimensions.zoom,
              height: height * this.pageDimensions.zoom,
              text: this.editorContent,
            },
        };
        this.$store.dispatch('workBook/updatePageText', payload);
      }
    }, 500),

    onDragging() {
      this.active = true;
    },

    onDrag: debounce(function(x, y) {
      if (this.user) {
          const payload = {
            workBookKey: this.workBook.id,
            pageKey: this.workBookPage.id,
            index: this.layerIndex,
            textLayer: {
              commit: this.workBookPage.textLayers[this.layerIndex].commit + 1,
              x: x * this.pageDimensions.zoom,
              y: y * this.pageDimensions.zoom,
              width: this.workBookPage.textLayers[this.layerIndex].width,
              height: this.workBookPage.textLayers[this.layerIndex].height,
              text: this.editorContent,
            },
          };
          this.$store.dispatch('workBook/updatePageText', payload);
      }
    }, 500),
  },
  watch: {
    workBookPage: {
      handler(oldPage, newPage) {
        if (this.workBookPage.textLayers[this.layerIndex].commit > this.editorCommits) {
          this.editorCommits = this.workBookPage.textLayers[this.layerIndex].commit;
          this.editorContent = this.workBookPage.textLayers[this.layerIndex].text;
          this.layerWidth = this.workBookPage.textLayers[this.layerIndex].width;
          this.layerHeight = this.workBookPage.textLayers[this.layerIndex].height;
        }
      },
      deep: true,
    },
    editorContent: {
      handler(oldText, newText) {
        if (this.workBookPage.textLayers[this.layerIndex]
          && this.editorContent !== this.workBookPage.textLayers[this.layerIndex].text
        ) {
          this.setMinDimensions();
          this.updateText();
        }
      },
    },
    modes: {
      handler(newMode, oldMode) {
        if (this.modes.mode !== modesEnum.TEXT) {
          this.active = false;
        } else {
          if (this.settings.activeEditor === this.layerIndex) {
            this.active = true;
            this.editor.focus();
          }
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
@import '../../../../node_modules/vue-draggable-resizable/dist/VueDraggableResizable.css';

.drag-handle {
  position: absolute;
  top: -10px;
  z-index: 2;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: rgba(0,0,0,0.3);
  cursor: grab;
}
.dragging {
  .drag-handle {
    cursor: grabbing;
  }
}

.text-outer-box {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.inactive-editor {
  user-select: none;
  .editor {
    user-select: none;
    * {
      user-select: none;
    }
  }
}

.editor {
  height: 100%;
  width: 100%;
  font-family: "Schoolbell";
  overflow: hidden;
  min-width: 20px;
  min-height: 1em;
  line-height: 1;
}
[contenteditable]:focus {
    outline: 0px solid transparent;
}

/* VDR OVERRIDES */
.handle {
  z-index: 3;
}
.vdr {
  border-color: rgba(0,0,0,0.3);
}

/* CONTENT FORMATTING */
.text-render, .editor {
  h1, h2, h3, h4, h5, h6 {
    margin: 5px 0 10px 0;
  }
  p {
    margin: 2px 0 2px 0;
  }
  td {
    vertical-align: top;
    padding: 3px;
  }
}
</style>
