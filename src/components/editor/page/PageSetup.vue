<template>
  <div v-if="!workBookData" class="loader-wrapper">
    <v-progress-circular
      indeterminate
      color="primary"
      size="70"
      width="7"
    ></v-progress-circular>
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
  name: 'PageSetup',
  components: { pdf },
  data() {
    return {
      appStrings,
    };
  },
  created() {
    console.log('PageSetup created');
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
    } else if (this.$route.params.workBookId && this.workBook && this.workBook.id !== this.$route.params.workBookId) {
      // coming in for first time
      this.setupPage();
    } else {
      console.log('no workbooks');
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
      workBooks: 'workBook/getWorkBooks',
      workBook: 'workBook/getWorkBook',
      workBookData: 'workBook/getWorkBookData',
      workBookPage: 'workBook/getWorkBookPage',
      pageDimensions: 'workBook/getCurrentPageDimensions',
    }),
  },
  methods: {
    setupPage() {
      const newWorkBook: IWorkBook | undefined = this.workBooks.find((workBook: IWorkBook) => {
        return workBook.id === this.$route.params.workBookId;
      });
      if (newWorkBook && !this.$route.params.pageId) {
        /* Missing page Id so set to first page */
        this.$store.commit('workBook/setCurrentPage', newWorkBook.pages[0].id);
        if (newWorkBook.id !== this.$route.params.workBookId) {
          const payload = {
            url: null,
            newWorkBook,
          };
          this.$store.dispatch('workBook/setWorkBook', payload);
        }
      } else if (newWorkBook && this.$route.params.pageId) {
        this.$store.commit('workBook/setCurrentPage', this.$route.params.pageId);
        if (newWorkBook.id !== this.$route.params.workBookId) {
          const payload = {
            url: null,
            newWorkBook,
          };
          this.$store.dispatch('workBook/setWorkBook', payload);
        }
      } else {
        // TODO
        console.log('no matching workbook');
      }
    },

    addWorkBook(url: string) {
      const loadingTask = pdf.createLoadingTask(url)
        .promise
        .then(async (result: any) => {
          result.getData().then((data: Uint8Array) => {
            /* Takes time to fetch pdf data - fetch first */
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
              /* use pdf dimensions to set paghe dimensions */
              const newPage: IWorkBookPage = {
                textLayers: [],
                drawingLayer: {
                  drawingCanvasImage: null,
                  penWidth: 1,
                  penColor: '#000000',
                },
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
          let payload;
          if (this.user) {
            newWorkBook.author = {
              name: this.user.name,
              avatar: this.user.photoUrl,
            };
            newWorkBook.members = [this.user.email];
          }
          this.$store.commit('workBook/setCurrentPage', newWorkBook.pages[0].id);
          payload = {
            url: null,
            newWorkBook,
          };
          this.$store.dispatch('workBook/setWorkBook', payload)
          .then((resp: any) => {
              this.$router.push('editor/' + newWorkBook.id);
            });
        });
    },
  },
  watch: {
    $route: {
      handler(from, to) {
        this.setupPage();
      },
      deep: true,
    },
  },
});
</script>
