<template>
  <v-dialog v-model="settings.showAddNoteDialog" persistent width="800px" max-width="95%">
    <v-card v-if="formObj">
      <v-system-bar
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <v-icon @click="close()">mdi-close</v-icon>
    </v-system-bar>

    <v-card-title>
      <span class="headline">Add Note</span>
    </v-card-title>

    <v-card-text>
      <v-container>
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
            <v-col cols="12">
              <v-textarea
                v-model="formObj.description"
                filled
                label="Description"
                auto-grow
              ></v-textarea>
            </v-col>
            <!-- CONNECTED TO -->
            <v-col cols="12">
              <v-text-field placeholder="https://" label="Connect to page" :rules="[rules.url]" v-model="formObj.connectedUrl"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>

    <!-- ACTIONS -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      <v-btn color="blue darken-1" text @click="saveNote()">Save</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import { uuid } from 'uuidv4';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { INoteBook } from '@/types';

const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export default Vue.extend({
  name: 'AddNoteBook',
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
      noteBooks: 'noteBook/getNoteBooks',
      settings: 'noteBook/getNoteBookSettings',
    }),
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
      const payload = {
        showAddNoteDialog: false,
      };
      this.$store.commit('noteBook/setSettings', payload);
      if (this.$route.name && this.$route.name === 'NoteBookRoot') {
        this.$router.push('/notebooks');
      }
    },

    saveNote() {
      if (this.$refs.form.validate()) {
        this.addNoteBook();
      }
    },

    setFormObj() {
      this.formObj = {
        title: this.$route.query.title ? this.$route.query.title : '',
        description: this.$route.query.description ? this.$route.query.description : '',
        connectedUrl: this.$route.query.connectedUrl ? this.$route.query.connectedUrl : '',
        categories: [],
        keywords: [],
      } as Partial<INoteBook>;
    },

    addNoteBook(url: string) {
      const newNoteBook: INoteBook = {
        title: this.formObj.title,
        description: this.formObj.description,
        connectedUrl: this.formObj.connectedUrl,
        members: [],
        template: false,
        sourceId: null,
        keywords: [],
        categories: [],
        public: false,
        commit: 0,
        modified: new Date(),
        id: uuid(),
        text: '',
      };
      let payload;
      if (this.user) {
        newNoteBook.author = {
          name: this.user.name,
          avatar: this.user.photoUrl,
        };
        newNoteBook.members = [this.user.email];
      }
      payload = {
        newNoteBook,
      };
      const vm = this;
      this.$store.dispatch('noteBook/addNoteBook', newNoteBook)
      .then((resp: any) => {
          this.$router.push('/notebook/' + newNoteBook.id, () => {
            vm.setFormObj();
            vm.close();
          });
        })
      .catch((error: any) => {
        console.error('Error creating note book:', error);
      });
    },
  },
});
</script>
