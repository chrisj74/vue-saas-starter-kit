<template>
  <div v-if="noteBook">
    <div class="mb-4 d-flex justify-space-between align-center">

      <h2 class="test flex-grow-1 pr-2 notebook-title">
        <span  v-if="!editing">{{ noteBook.title }}</span>
        <v-text-field
          solo
          full-width
          dense
          autofocus
          hide-details="auto"
          v-else
          v-model="details.title"></v-text-field>
      </h2>

      <v-btn
        dense
        small
        @click="toggleEdit()">
        <span v-html="editing ? 'Done' : 'Edit'"></span>
      </v-btn>

    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import debounce from 'lodash/debounce';
/* App components */

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'NoteBookDetails',
  data() {
    return {
      appStrings,
      editing: false,
      detailsCommits: 0,
      details: {
        title: null,
      },
      detailsSet: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      noteBook: 'noteBook/getNoteBook',
      settings: 'noteBook/getNoteBookSettings',
    }),
  },
  destroyed() {
    console.log('details destroyed');
    this.details.title = '';
    this.detailsCommits = 0;
    this.$store.commit('noteBook/setNoteBook', null);
  },
  mounted() {
    console.log('details mounted');
    if (this.noteBook && this.noteBook.title) {
      console.log('mounted', this.noteBook);
      this.details.title = this.noteBook.title;
      this.detailsCommits = this.noteBook.commit;
    }
  },
  methods: {
    toggleEdit() {
      console.log('details=', this.details);
      this.editing = !this.editing;
    },

    updateDetails: debounce(function() {
      this.detailsCommits++;
      const payload = {
        title: this.details.title,
      };
      this.$store.dispatch('noteBook/updateNoteBook', payload);
    }, 1000),
  },
  watch: {
    noteBook: {
      handler(oldPage, newPage) {
        if (this.noteBook.commit > this.detailsCommits) {
          this.details.title = this.noteBook.title;
          this.detailsCommits = this.noteBook.commit;
        }
      },
      deep: true,
    },

    details: {
      handler(oldPage, newPage) {
        if (this.detailsSet) {
          /* Stop initial value triggering update */
          this.updateDetails();
        } else {
          this.detailsSet = true;
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
  h2.notebook-title {
    font-size: 1.5em;
    .v-input {
      font-size: inherit;
    }
  }
</style>
