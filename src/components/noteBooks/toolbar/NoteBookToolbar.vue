<template>
  <div class="flex-grow-1 d-flex justify-center">
    <div class="note-text-toolbar">
    </div>
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
  name: 'NoteBookToolbar',
  components: {  },
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
.note-text-toolbar {
  margin-top: 5px;
}
</style>
