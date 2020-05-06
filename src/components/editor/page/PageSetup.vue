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
  mounted() {
    if (this.workBooks) {
      /* Store loaded */
      if (this.$route.query.pdf) {
        this.checkPdfExisits();
      } else if (this.$route.params.workBookId && this.workBook && this.workBook.id !== this.$route.params.workBookId) {
        // coming in for first time
        this.setupPage();
      } else if (this.$route.params.workBookId && this.workBooks) {
        this.setupPage();
      }
    }
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
      currentPageId: 'workBook/getCurrentPageId',
    }),
  },
  methods: {
    checkPdfExisits() {
      if (this.workBooks) {
        /* TODO update to filter and cater for multiple matches */
        const existingWorkBook = this.workBooks.find((workBook: IWorkBook) => {
          return workBook.url === this.$route.query.pdf;
        });
        if (existingWorkBook) {
          /* Has workbook so redirect */
          this.$router.push('/editor/' + existingWorkBook.id);
        } else {
          /* Missing so create new */
          this.addWorkBook(this.$route.query.pdf);
        }
      }
    },

    setupPage() {
      const newWorkBook: IWorkBook | undefined = this.workBooks.find((workBook: IWorkBook) => {
        return workBook.id === this.$route.params.workBookId;
      });

      if (newWorkBook && (!this.workBook || newWorkBook.id !== this.workBook.id)) {
        /* New workbook so setup */
          const loadingTask = pdf.createLoadingTask(newWorkBook.url)
          .promise
          .then(async (result: any) => {
            result.getData().then((data: Uint8Array) => {
              /* Takes time to fetch pdf data - fetch first */
              this.$store.commit('workBook/setWorkBookData', data);

              const payload = newWorkBook.id;
              this.$store.dispatch('workBook/setWorkBook', payload);
              /* Set page */
              console.log('pageSetup setupPage() ');
              if (newWorkBook && newWorkBook.pages && !this.$route.params.pageId) {
                /* Missing page Id so set to first page */
                this.$store.commit('workBook/setCurrentPage', newWorkBook.pages[0].id);
              } else if (newWorkBook && this.$route.params.pageId) {
                this.$store.commit('workBook/setCurrentPage', this.$route.params.pageId);
              } else {
                // TODO
                console.error('PageSetup loading task complete but no matching workbook');
              }
            });
          }, (error: any) => {
            console.error('Issue getting pdf in setupPage:', error);
          });
        } else {
          /* Change page on same workBook */
          if (this.$route.params.pageId) {
            this.$store.commit('workBook/setCurrentPage', this.$route.params.pageId);
          } else if (newWorkBook && newWorkBook.pages && !this.$route.params.pageId) {
            /* Missing page Id so set to first page */
            this.$store.commit('workBook/setCurrentPage', newWorkBook.pages[0].id);
          }

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
          // this.$store.commit('workBook/setCurrentPage', newWorkBook.pages[0].id);
          payload = {
            url: null,
            newWorkBook,
          };
          this.$store.dispatch('workBook/addWorkBook', newWorkBook)
          .then((resp: any) => {
              this.$router.push('editor/' + newWorkBook.id);
            });
        });
    },
  },
  watch: {
    $route: {
      handler(from, to) {
        if (this.$route.query.pdf) {
          this.checkPdfExisits();
        } else {
          this.setupPage();
        }

        /* Reset extra tools */
        const payload: any = {
          showDrawingExtras: false,
        };
        this.$store.commit('workBook/setSettings', payload);
      },
      deep: true,
    },
    workBooks: {
      handler(oldVal, newVal) {
        if (this.$route.query.pdf) {
          this.checkPdfExisits();
        } else if ((this.$route.params.workBookId
          && this.workBook
          && this.workBook.id !== this.$route.params.workBookId)
          || (this.$route.params.workBookId
          && this.workBook && !this.currentPageId)
        ) {
          // coming in for first time
          this.setupPage();
        } else if (this.$route.params.workBookId) {
          this.setupPage();
        }
      },
      deep: true,
    },
  },
});
</script>
