<template>
  <div
    class="pdf-wrapper"
    :style="{
      width: pageDimensions? (pageDimensions.width) + 'px' : '100%',
    }">
    <pdf
      v-if="workBook && workBookData && workBookPage"
      :src="workBookData"
      :page="workBookPage.order + 1"
      @num-pages="pageCount = $event"
      @page-loaded="loaded = $event"
    ></pdf>
    <div v-if="loaded === 0" class="loader-wrapper">
      <v-progress-circular
        indeterminate
        color="primary"
        size="70"
        width="7"
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
import { uuid } from 'uuidv4';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { IWorkBook, IWorkBookPage, toolActionEnum } from '@/types';

export default Vue.extend({
  name: 'ViewPdf',
  components: { pdf },
  data() {
    return {
      appStrings,
      pdfPath: null,
      currentPage: 0,
      pageCount: 0,
      docData: null,
      loaded: 0,
    };
  },
  created() {
    if (this.$route.query.pdf) {
      const payload = {
        url: this.$route.query.pdf,
        newWorkBook: null,
      };
      this.$store.dispatch('workBook/setWorkBook', this.$route.query.pdf)
        .then((hasWorkBook: boolean) => {
          if (!hasWorkBook) {
            this.addWorkBook(this.$route.query.pdf);
          }
        });
    }
  },
  mounted() {
    // Mounted
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookData: 'workBook/getWorkBookData',
      workBookPages: 'workBook/getWorkBookPages',
      workBookPage: 'workBook/getWorkBookPage',
      pageDimensions: 'workBook/getCurrentPageDimensions',

    }),
  },
  methods: {
    addWorkBook(url: string) {
      const loadingTask = pdf.createLoadingTask(url)
        .promise
        .then(async (result: any) => {
          console.log('result=', result.getData());
          result.getData().then((data: Uint8Array) => {
            this.$store.commit('workBook/setWorkBookData', data);
          });
          const newWorkBook: IWorkBook = {
            members: [],
            template: false,
            sourceId: null,
            keywords: [],
            categories: [],
            public: false,
            commit: 0,
            url,
            modified: new Date(),
            id: uuid(),
            pages: [],
          };
          for (let i: number = 0; i < result.numPages; i++) {
            await result.getPage(i + 1)
            .then((page: any) => {
              console.log('page=', page);
              const newPage: IWorkBookPage = {
                textLayers: [],
                dimensions: {
                  width: page.view[2],
                  height: page.view[3],
                },
                commit: 0,
                modified: new Date(),
                order: i,
                id: uuid(),
              };
              newWorkBook.pages.push(newPage);
            });
          }
          if (this.user) {
            newWorkBook.author = {
              name: this.user.name,
              avatar: this.user.photoUrl,
            };
            newWorkBook.members = [this.user.email];
          }
          this.$store.commit('workBook/setCurrentPage', newWorkBook.pages[0].id);
          const payload = {
            url: null,
            newWorkBook,
          };
          this.$store.dispatch('workBook/setWorkBook', payload);
        });
    },
  },
  watch: {
    loaded: {
      handler(newLoaded, oldLoaded) {
        if (oldLoaded === 0) {
          this.$store.commit('workBook/setToolAction', toolActionEnum.PAGE_LOADED);
        }
      },
    },
  },
});
</script>

<style lang="scss">
.pdf-wrapper {
  width: 100%;
  position: relative;
  z-index: 1;
}
.loader-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

</style>
