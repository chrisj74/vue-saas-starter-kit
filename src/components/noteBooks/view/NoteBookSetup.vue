<template>
  <div v-if="!noteBook">

  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */

/* App components */

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'NoteBookSetup',
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
      noteBook: 'noteBook/getNoteBook',
      noteBooks: 'noteBook/getNoteBooks',
      settings: 'noteBook/getNoteBookSettings',
    }),
  },
  mounted() {
    const vm = this;
    if (this.noteBooks || !this.user) {
      if (!this.$route.params.noteBookId) {
        this.showAddNoteBook();
      } else if (
        this.$route.params.noteBookId
        && this.noteBook
        && this.noteBook.id !== this.$route.params.noteBookId) {
        /* Different Notebook */
        this.setup();
      } else if (!this.noteBook && this.$route.params.noteBookId) {
        /* First NoteBook */
        this.setup();
      }
    }
  },
  methods: {
    setup() {
      this.$store.dispatch('noteBook/setNoteBook', this.$route.params.noteBookId);
    },

    showAddNoteBook() {
      const payload = {
        showAddNoteDialog: true,
      };
      this.$store.commit('noteBook/setSettings', payload);
    },
  },
  watch: {
    noteBooks: {
      handler(oldVal, newVal) {
        if (!this.$route.params.noteBookId) {
          this.showAddNoteBook();
        } else if (
          this.$route.params.noteBookId
          && this.noteBook
          && this.noteBook.id !== this.$route.params.noteBookId) {
          /* Different Notebook */
          this.setup();
        } else if (!this.noteBook && this.$route.params.noteBookId) {
          /* First NoteBook */
          this.setup();
        }
      },
      deep: true,
    },
    $route: {
      handler(oldVal, newVal) {
        if (!this.$route.params.noteBookId) {
          this.showAddNoteBook();
        } else if (
          this.$route.params.noteBookId
          && this.noteBook
          && this.noteBook.id !== this.$route.params.noteBookId) {
          /* Different Notebook */
          this.setup();
        } else if (!this.noteBook && this.$route.params.noteBookId) {
          /* First NoteBook */
          this.setup();
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">

</style>
