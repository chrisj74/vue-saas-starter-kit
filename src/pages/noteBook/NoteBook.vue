<template>
  <v-container fluid>
    <div>
      <note-book></note-book>

      <add-note-book></add-note-book>
    </div>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import NoteBook from '@/components/noteBooks/NoteBook.vue';
import AddNoteBook from '@/components/noteBooks/modals/AddNoteBook.vue';

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'Editor',
  components: { NoteBook, AddNoteBook },
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
    }),
  },
  methods: {
    //
  },
});
</script>
