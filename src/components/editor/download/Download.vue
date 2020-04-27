
<template>
  <div>
    <div
      ref="previewGenerator"
      v-if="pages && photoImagesGenerated"
      class="preview-wrapper"
      :style="{
        width: pages[previewIndex].dimensions.width + 'px',
        height: pages[previewIndex].dimensions.height + 'px',
      }"
      >
      <div class="preview">
        <pdf
          class="preview-pdf"
          :src="workBookData"
          :page="previewIndex + 1"
          @page-loaded="previewPageLoaded = $event"
        ></pdf>
        <img
          v-if="pages[previewIndex].drawingLayer['drawingCanvasImage']"
          :src="pages[previewIndex].drawingLayer['drawingCanvasImage']"
          class="preview-drawing" />
      </div>

      <!-- Download pdf link -->
      <div class="download-link" v-if="pdfSrc">
        <a :href="pdfSrc" ref="pdfDownloadLink" download="page">Download</a>
      </div>
    </div>

    <!-- export dialog -->
    <v-dialog
      v-if="dialogs"
      v-model="dialogs.export"
      max-width="95vw"
      width="500px"
      persistent>
      <v-card>
        <v-system-bar
          color="primary"
          dark
        >
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="closeDialog()">
            <v-icon extra-small>mdi-close</v-icon>
          </v-btn>

        </v-system-bar>
        <v-card-title class="headline">Export</v-card-title>
        <v-card-text>
          <div v-if="!pdfSrc || pdfSrc.length === 0">
            <v-progress-circular
              indeterminate
              color="primary"
              size="20"
              width="2"
            ></v-progress-circular>
            <p>Busy creating your export...</p>
          </div>
          <div v-else>
            <v-btn @click="doDownload()">
              Download
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog()">Cancel</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import pdf from 'vue-pdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { toolActionEnum, IWorkBookPage, exportTypesEnum } from '@/types';

export default Vue.extend({
  name: 'Download',
  components: { pdf },
  data() {
    return {
      appStrings,
      loaded: 0,
      previewIndex: 0,
      previewImages: [],
      previewSrc: '',
      photoImagesGenerated: true, // TODO
      pdfSrc: null,
      previewPageLoaded: null,
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
      toolAction: 'workBook/getToolAction',
      settings: 'workBook/getSettings',
      dialogs: 'workBook/getDialogs',
    }),
  },
  methods: {
    getPageImages(isPdf: boolean, allPages: boolean) {
      this.$store.commit('base/setLoading', true);
      this.previewIndex = 0;
      this.previewImages = [];
      this.getPageImage(exportTypesEnum.PDF, allPages);
    },

    getPageImage(type: exportTypesEnum, allPages: boolean, pageIndex?: number) {
      console.log('getPageImage');
      if (!allPages && pageIndex) {
        this.$store.commit('base/setLoading', true);
        this.previewIndex = pageIndex;
        this.previewImages = [];
      }

      const el = this.$refs.previewGenerator;
      const vm = this;
      const nextAllPages = allPages;
      const nextType = type;
      const nextPageIndex = pageIndex;
      const options = {
        type: 'dataURL',
        useCORS: true,
        logging: false,
      };

      this.$nextTick().then(async function() {
        console.log('previewLoaded=', vm.previewPageLoaded);
        console.log('previewIndex=', vm.previewIndex);

        const waitForPage = (timeoutms: number) => new Promise((r, j) => {
          const check = () => {
            console.warn('checking')
            if (vm.previewPageLoaded === vm.previewIndex + 1) {
              console.log('equal');
              r();
            } else if (timeoutms < 0) {
                j(false);
            } else {
              timeoutms -= 100;
              setTimeout(check, 100);
            }
          };
          setTimeout(check, 100);
        });
        await waitForPage(5000);
        console.log('past while');
        vm.$html2canvas(el, options).then((th: string) => {
          vm.previewImages.push(th);
          if (vm.previewIndex < vm.pages.length - 1 && nextAllPages) {
            vm.previewIndex++;
            vm.getPageImage(nextType, nextAllPages);
          } else if (nextType === exportTypesEnum.PDF) {
            vm.createPdf();
          } /* TODO
          else if (nextType === exportTypesEnum.DOWNLOAD_PAGE) {
            vm.$store.commit('base/setLoading', false);
            vm.doDownload();
          } else if (nextType === exportTypesEnum.UPLOAD_PAGE) {
            vm.$store.commit('base/setLoading', false);
            vm.doUpload();
          } */
        });
      });
    },

    createPdf() {
      const docDefinition = {
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'landscape',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: 40,
        content: [] as any[],
      };
      const dimensions = [];
      this.previewImages.forEach((image: string, index: number) => {
        let pageBreak = '';
        if (index === 0) {
          docDefinition.pageOrientation = this.pages[index].dimensions.width > this.pages[index].dimensions.height ? 'landscape' : 'portrait';
        }
        if (index > 0) {
          pageBreak = 'before';
        }
        docDefinition.content.push({
          image,
          fit: this.pages[index].dimensions.width > this.pages[index].dimensions.height ?
           [868 - 80, 595 - 80] : [595 - 80, 868 - 80],
          pageOrientation: this.pages[index].dimensions.width > this.pages[index].dimensions.height ? 'landscape' : 'portrait',
          pageBreak,
        });
      });
      const vm = this;
      const pdfDocGenerator = pdfMake
        .createPdf(docDefinition);
      pdfDocGenerator.getDataUrl((dataUrl: string) => {
        vm.pdfSrc = dataUrl;
        vm.downloadPdf = false;
        vm.$store.commit('base/setLoading', false);
      });
    },

    /* Dialog */
    closeDialog() {
      const payload = {
        export: false,
      };
      this.$store.commit('workBook/setDialogs', payload);
    },

    doDownload() {
      this.$refs.pdfDownloadLink.click();
      this.closeDialog();
    },
  },
  watch: {
    toolAction: {
      handler(newAction, oldAction) {
        if (this.toolAction === toolActionEnum.GENERATE_PDF) {
          this.getPageImages(true, true);
          this.$store.commit('workBook/setToolAction', null);
        }
      },
    },
    dialogs: {
      handler(newAction, oldAction) {
        if (this.dialogs.export) {
          this.pdfSrc = '';
          this.getPageImages(true, true);
        }
      },
    },
  },
});
</script>

<style lang="scss">
.preview-wrapper{
  position: absolute;
  left: -5000px;
  top: 0;
  .preview {
    position: relative;
    width: 100%;
    .preview-pdf {
      top: 0;
      left: 0;
      position: relative;
      z-index: 1;
    }
    .preview-drawing{
      max-width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
    }
  }
}
.download-link {
  display: none;
}
</style>
