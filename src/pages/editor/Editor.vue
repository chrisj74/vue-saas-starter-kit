<template>
  <v-container fluid>
    <div class="editor-wrapper">
      <toolbar></toolbar>
      <thumbs></thumbs>
      <page></page>
      <add-work-book></add-work-book>
    </div>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import Page from '@/components/editor/Page.vue';
import Thumbs from '@/components/editor/Thumbs.vue';
import Toolbar from '@/components/editor/Toolbar.vue';
import AddWorkBook from '@/components/editor/modals/AddWorkBook.vue';

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'Editor',
  components: { Page, Thumbs, Toolbar, AddWorkBook },
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
      workBook: 'workBook/getWorkBook',
      pages: 'workBook/getWorkBookPages',
    }),
  },
  methods: {
    //
  },
});
</script>
