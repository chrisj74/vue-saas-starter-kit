<template>
  <v-dialog v-model="settings.showAddWorkBookDialog" persistent width="800px" max-width="95%" max-height="80vh">
    <v-card v-if="formObj">
      <v-system-bar
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <v-icon @click="close()">mdi-close</v-icon>
    </v-system-bar>

    <v-card-title>
      <span class="headline">New Work Book</span>
    </v-card-title>

    <v-card-text
      style="max-height: 80vh; overflow: auto;">
      <v-container>
        <div v-if="!user">
          <p>Hey, just letting you know, you need to export your work book before you leave this page.</p>
          <p>You're changes are not saved anywhere, so don't forget!</p>
        </div>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <!-- TITLE -->
            <v-col cols="12">
              <v-text-field label="Title *" required :rules="[rules.required]" v-model="formObj.title"></v-text-field>
            </v-col>
            <!-- DESCRIPTION -->
            <v-col cols="12" v-if="user">
              <v-textarea
                v-model="formObj.description"
                filled
                label="Description"
                auto-grow
                :rows="1"
              ></v-textarea>
            </v-col>
            <!-- CONNECTED TO -->
            <v-col cols="12" v-if="user">
              <v-text-field placeholder="https://" label="Connect to page" :rules="[rules.url]" v-model="formObj.connectedUrl"></v-text-field>
            </v-col>
            <!-- SRC DOC
            <v-col cols="12">
              <v-text-field :readonly="srcDocUrlReadOnly" placeholder="https://" label="Source document" :rules="[rules.url]" v-model="formObj.srcDocUrl"></v-text-field>
            </v-col>
            -->
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>

    <!-- ACTIONS -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="saveWorkBook()">Start</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
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
import { IWorkBook, IWorkBookPage } from '@/types';

const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export default Vue.extend({
  name: 'AddWorkBook',
  data() {
    return {
      appStrings,
      formObj: null,
      valid: true,
      rules: {
        required: (value: any) => !!value || 'Required.',
        counter: (value: any) => value.length <= 20 || 'Max 20 characters',
        email: (value: any) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
        url: (value: any) => {
          return (urlRegex.test(value) || !value || value.length === 0) || 'Invalid web address.';
        },
      },
    };
  },

  mounted() {
    this.setFormObj();
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBooks: 'workBook/getWorkBooks',
      settings: 'workBook/getSettings',
      inIframe: 'base/getInIframe',
      env: 'base/getEnv',
      extensionInstalled: 'base/getExtensionInstalled',
    }),
    srcDocUrlReadOnly() {
      return this.$route.params.pdf;
    },
    maxCols() {
      let max: number = 1;
      if (this.$vuetify.breakpoint.name === 'md') {
        max = 2;
      } else if (this.$vuetify.breakpoint.name === 'lg') {
        max = 3;
      } else if (this.$vuetify.breakpoint.name === 'xl') {
        max = 4;
      }
      return max;
    },
  },
  methods: {
    close() {
      if (this.inIframe && !this.user) {
        this.removeSplit();
      } else {
        const payload = {
          showAddWorkBookDialog: false,
        };
        this.$store.commit('workBook/setSettings', payload);
        if (this.$route.name && this.$route.name === 'WorkBookRoot') {
          this.$router.replace('/workbooks');
        }
      }
    },

    removeSplit() {
      parent.postMessage({type: 'removeSplit'}, '*');
    },

    saveWorkBook() {
      if (this.$refs.form.validate()) {
        this.addWorkBook();
      }
    },

    setFormObj() {
      this.formObj = {
        title: this.$route.query.title ? this.$route.query.title : '',
        description: this.$route.query.description ? this.$route.query.description : '',
        connectedUrl: this.$route.query.connectedUrl ? this.$route.query.connectedUrl : '',
        srcDocUrl: this.$route.query.pdf ? this.$route.query.pdf : '',
        categories: [],
        keywords: [],
      } as Partial<IWorkBook>;
    },

    addWorkBook() {
      const loadingTask = pdf.createLoadingTask(this.formObj.srcDocUrl)
        .promise
        .then(async (result: any) => {
          if (!this.user) {
            result.getData().then((data: Uint8Array) => {
              /* Takes time to fetch pdf data - fetch first */
              this.$store.commit('workBook/setWorkBookData', data);
            });
          }
          const connectedUrl = this.$route.query.connectTo ? this.$route.query.connectTo : null;
          const newWorkBook: IWorkBook = {
            title: this.formObj.title,
            description: this.formObj.description,
            connectedUrl: this.formObj.connectedUrl,
            srcDocUrl: this.formObj.srcDocUrl,
            members: [],
            template: false,
            sourceId: null,
            keywords: [],
            categories: [],
            public: false,
            commit: 0,
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
          payload = {
            url: null,
            newWorkBook,
          };
          const vm = this;
          this.$store.dispatch('workBook/addWorkBook', newWorkBook)
          .then((resp: any) => {
              this.$router.replace('/workbook/' + newWorkBook.id, () => {
                console.log('router push done');
                vm.setFormObj();
                vm.close();
              });
          })
          .catch((error: any) => {
            console.error('Error creating work book:', error);
          });
        });
    },
  },
});
</script>
