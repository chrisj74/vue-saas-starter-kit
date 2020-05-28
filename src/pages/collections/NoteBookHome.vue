<template>
  <v-container fluid>
    <div>
      <h2>Learnalong Note Books<v-btn icon fab @click="showAddNoteBook()"><v-icon>mdi-plus</v-icon></v-btn></h2>
      <div class="mt-4">
        <v-btn @click="toggleEdit()" dense small><span v-html="showEdit ? 'Done' : 'Edit'"></span></v-btn>
      </div>
      <v-row>
        <v-col v-for="(noteBook) in noteBooks" :key="noteBook.id" :sm:="6" :md="4" :lg="3" :class="'notebook-card'">
          <v-card>
            <v-card-text><router-link  :to="'/notebook/' + noteBook.id">{{ noteBook.title }}</router-link></v-card-text>
            <v-divider></v-divider>
            <v-card-actions v-if="!showEdit">
              <v-spacer />
              <v-btn :to="'/notebook/' + noteBook.id" small dense>View</v-btn>
            </v-card-actions>
            <v-card-actions v-else class="d-flex justify-lg-space-between">
              <v-btn icon x-small fab color="error" @click="confirmDelete(noteBook)"><v-icon>mdi-delete</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog
      v-model="showDeleteDialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Delete Notebook
        </v-card-title>

        <v-card-text>
          Are you sure? There is no undo, once this little fella is gone he's gone for good.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text
            @click="closeConfirmDelete()">
            Stop! I want to keep it
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteNoteBook()"
          >
            Go ahead and delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <add-note-book></add-note-book>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import { uuid } from 'uuidv4';

/* App components */
import AddNoteBook from '@/components/noteBooks/modals/AddNoteBook.vue';

/* Utils */
import { appStrings } from '@/utils';
import { INoteBook } from '@/types';

export default Vue.extend({
  name: 'NoteBooks',
  components: { AddNoteBook },
  data() {
    return {
      appStrings,
      showEdit: false,
      showDeleteDialog: false,
      noteBookToDelete: null,
    };
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
    toggleEdit() {
      this.showEdit = !this.showEdit;
    },

    showAddNoteBook() {
      const payload = {
        showAddNoteDialog: true,
      };
      this.$store.commit('noteBook/setSettings', payload);
    },

    confirmDelete(noteBook: INoteBook) {
      this.noteBookToDelete = noteBook;
      this.showDeleteDialog = true;
    },

    deleteNoteBook() {
      this.$store.dispatch('noteBook/deleteNoteBook', this.noteBookToDelete)
      .then(() => {
        this.closeConfirmDelete();
      });
    },

    closeConfirmDelete() {
      this.showDeleteDialog = false;
      this.noteBookToDelete = null;
    },
  },
});
</script>

<style lang="scss">
.notebook-card {
  a {
    text-decoration: none;
  }
}
</style>
