<template>
  <div class="page-wrapper" ref="page">
    <note-book-setup></note-book-setup>
    <note-book-editor></note-book-editor>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */

/* App components */
import NoteBookDownload from '@/components/noteBooks/modals/NoteBookDownload.vue';
import NoteBookSetup from '@/components/noteBooks/view/NoteBookSetup.vue';
import NoteBookEditor from '@/components/noteBooks/view/NoteBookEditor.vue';

/* Utils */
import { appStrings } from '@/utils';
import {  } from '@/types';

export default Vue.extend({
  name: 'NoteBook',
  components: { NoteBookDownload, NoteBookSetup, NoteBookEditor },
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
      workBook: 'noteBook/getNoteBook',
      settings: 'noteBook/getNoteBookSettings',
    }),
  },
  mounted() {
    const vm = this;

  },
  methods: {
    //
  },
  watch: {
     //
  },
});
</script>

<style lang="scss">

</style>
