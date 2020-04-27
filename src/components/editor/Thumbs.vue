<template>
  <div class="thumbs-wrapper" v-if="workBookData">
    <thumb
      class="thumb-wrapper"
      v-for="(page, index) in pages"
      :key="page.id"
      :pageIndex="index"
      :pageLoaded="pageLoaded"
      >

    </thumb>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import Thumb from '@/components/editor/thumbs/Thumb.vue';

/* Utils */
import { appStrings } from '@/utils';

/* Types */
import { toolActionEnum } from '@/types';

export default Vue.extend({
  name: 'Thumbs',
  components: { Thumb },
  data() {
    return {
      appStrings,
      pageLoaded: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      workBook: 'workBook/getWorkBook',
      workBookData: 'workBook/getWorkBookData',
      pages: 'workBook/getWorkBookPages',
      toolAction: 'workBook/getToolAction',
    }),
  },
  methods: {
    //
  },
  watch: {
    toolAction: {
      handler(newAction, oldAction) {
        if (this.toolAction === toolActionEnum.PAGE_LOADED) {
          this.pageLoaded = true;
          this.$store.commit('workBook/setToolAction', null);
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
.thumbs-wrapper {
  position: fixed;
  left: 0;
  top: 80px;
  width: 100px;
  max-height: calc(100vh - 100px);
  border: solid 1px #ccc;
  background-color: #fff;
  overflow: auto;
  z-index: 99;
  .thumb-wrapper {
    margin-bottom: 5px;
  }
}
</style>
