<template>
  <div
    class="pdf-wrapper"
    :style="{
      width: pageDimensions? (pageDimensions.width) + 'px' : '100%',
    }">
    <pdf
      v-if="workBook && workBookData && workBookPage"
      :src="workBookData"
      :page="workBookPage.order + 1"
      @page-loaded="loaded = $event"
    ></pdf>
    <div v-if="loaded === 0" class="loader-wrapper">
      <v-progress-circular
        indeterminate
        color="primary"
        size="70"
        width="7"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */
import pdf from 'vue-pdf';
import { uuid } from 'uuidv4';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { IWorkBook, IWorkBookPage, toolActionEnum } from '@/types';

export default Vue.extend({
  name: 'ViewPdf',
  components: { pdf },
  data() {
    return {
      appStrings,
      loaded: 0,
    };
  },
  created() {
    // Created
  },
  mounted() {
    // Mounted
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookData: 'workBook/getWorkBookData',
      workBookPage: 'workBook/getWorkBookPage',
      pageDimensions: 'workBook/getCurrentPageDimensions',
    }),
  },
  methods: {
    // Methods
  },
  watch: {
    loaded: {
      handler(newLoaded, oldLoaded) {
        if (oldLoaded === 0) {
          /* Only trigger after initial page load */
          this.$store.commit('workBook/setToolAction', toolActionEnum.PAGE_LOADED);
        }
      },
    },
  },
});
</script>

<style lang="scss">
.pdf-wrapper {
  width: 100%;
  position: relative;
  z-index: 1;
}
.loader-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

</style>
