<template>
  <v-container fluid>
    <div>
      <h2>Note Books 2 <v-btn icon @click="showAddNoteBook()"><v-icon>mdi-plus</v-icon></v-btn></h2>
      <v-row>
        <v-col v-for="(noteBook) in noteBooks" :key="noteBook.id">
          <p>{{ noteBook.title }}</p>
          <v-btn :to="'/notebook/' + noteBook.id">View</v-btn>
        </v-col>
      </v-row>
    </div>

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
    showAddNoteBook() {
      const payload = {
        showAddNoteDialog: true,
      };
      this.$store.commit('noteBook/setSettings', payload);
    },
  },
});
</script>
