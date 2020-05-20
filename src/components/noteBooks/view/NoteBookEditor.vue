<template>
  <div v-if="noteBook" class="container">
    <div class="note-editor-wrapper elevation-2">
      <tinymce-editor
        :key="noteBook.id"
        v-model="editorContent"
        class="note-editor"
        v-if="editorConfig"
        api-key="p0igcqysw2jkny4v7wki9qyg6p05lplhpctohfurcbsjc7dp"
        :init="editorConfig"
        @onInit="onEditorReady">
      </tinymce-editor>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import Editor from '@tinymce/tinymce-vue';
import debounce from 'lodash/debounce';
/* App components */

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'NoteBookEditor',
  components: { 'tinymce-editor': Editor },
  data() {
    return {
      appStrings,
      editorConfig: null,
      editor: null,
      contentSet: false,
      editorCommits: 0,
      editorContent: null,
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
  mounted() {
    this.editorConfig = {
      plugins: 'wordcount, table, media, emoticons, lists',
      inline: true,
      fixed_toolbar_container: '.note-text-toolbar',
      menubar: false,
      draggable_modal: true,
      toolbar: ' alignleft aligncenter alignright | styleselect | bold italic emoticons | table media | bullist numlist | fontsizeselect fontselect | forecolor',
      toolbar_drawer: 'floating',
      font_formats: 'Arial=arial,helvetica,sans-serif; Arial Black=arial black, sans-serif; Times=TimesNewRoman, Times New Roman, Times, Baskerville, Georgia, serif; Courier New=courier new,courier,monospace; Handwriting=Schoolbell;',
      fontsize_formats: '9px 11px 12px 14px 16px 18px 20px 24px 36px 48px 56px',
      contextmenu: 'inserttable | cell row column deletetable',
      mobile: {
        theme: 'mobile',
        plugins: 'lists, autolink',
        toolbar: 'undo, bold, italic, styleselect',
      },
    };
  },
  methods: {
    onEditorReady(event: any, editor: any) {
      this.editor = editor;
      this.contentSet = true;
      editor.focus();
    },

    updateText: debounce(function() {
      this.editorCommits++;
      const payload = {
        text: this.editorContent,
      };
      this.$store.dispatch('noteBook/updateNoteBook', payload);
    }, 1000),
  },
  watch: {
     noteBook: {
      handler(oldPage, newPage) {
        if (this.noteBook.commit > this.editorCommits) {
          this.editorCommits = this.noteBook.commit;
          this.editorContent = this.noteBook.text;
        }
      },
      deep: true,
    },
    editorContent: {
      handler(oldText, newText) {
        if (this.editorContent !== this.noteBook.text) {
          this.updateText();
        }
      },
    },
  },
});
</script>

<style lang="scss">
.note-editor-wrapper {
  min-height: 4em;
  padding: 5px;
}
.note-editor {
  height: 100%;
  width: 100%;
  overflow: hidden;
  min-width: 20px;
  min-height: 1em;
  line-height: 1;
  font-family: arial,helvetica,sans-serif;
}
[contenteditable]:focus {
    outline: 0px solid transparent;
}
</style>
