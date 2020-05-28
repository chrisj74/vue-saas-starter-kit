<template>
  <div>

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
  name: 'NoteBookDownload',
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

</style>
