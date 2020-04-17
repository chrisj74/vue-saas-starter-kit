<template>
  <div>
    {{currentPage}} / {{pageCount}}
    <pdf
      v-if="workBook && workBook.url && workBookPage"
      :src="workBook.url"
      :page="workBookPage.order + 1"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
    ></pdf>
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
import { IWorkBook, IWorkBookPage } from '../../types';

export default Vue.extend({
  name: 'ViewPdf',
  components: { pdf },
  data() {
    return {
      appStrings,
      pdfPath: null,
      currentPage: 0,
      pageCount: 0,
    };
  },
  created() {
    if (this.$route.query.pdf) {
      const payload = {
        url: this.$route.query.pdf,
        newWorkBook: null,
      }
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
      workBookPages: 'workBook/getWorkBookPages',
      workBookPage: 'workBook/getWorkBookPage',

    }),
  },
  methods: {
    addWorkBook(url: string) {
      const loadingTask = pdf.createLoadingTask(url)
        .promise
        .then(async (result: any) => {
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
              const newPage: IWorkBookPage = {
                textLayers: [],
                dimensions: {
                  width: page[2],
                  height: page[3],
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
});
</script>
