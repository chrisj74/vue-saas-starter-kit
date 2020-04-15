<template>
  <v-container fluid>
    <div>
      View Page
      <view-pdf></view-pdf>
    </div>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import ViewPdf from '@/components/editor/ViewPdf.vue';

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'ViewPage',
  components: { ViewPdf },
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
    }),
  },
  methods: {
    //
  },
});
</script>
