<template>
  <div>
    <div class="v-btn-toggle v-item-group">
      <v-btn
        icon
        small
        light
        @click="setDraw()"
        >
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
    </div>

    <div class="v-btn-toggle v-item-group">
      <v-btn
        icon
        small
        light
        :disabled="!pageDimensions || pageDimensions.zoom <= pageDimensions.maxHeightRatio"
        @click="setZoomOut()"
        >
        <v-icon>mdi-magnify-minus</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        light
        :disabled="!pageDimensions || pageDimensions.zoom >= pageDimensions.maxWidthRatio"
        @click="setZoomIn()"
        >
        <v-icon>mdi-magnify-plus</v-icon>
      </v-btn>
    </div>
    <v-btn
      icon
      small
      light
      >
      <v-icon>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */

/* Utils */
import { appStrings } from '@/utils';
import { modesEnum, subModesEnum } from '../../../types';

export default Vue.extend({
  name: 'TopToolbar',
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
      pageDimensions: 'workBook/getCurrentPageDimensions',
      modes: 'workBook/getModes',
    }),
  },
  methods: {
    setZoomIn() {
      this.$store.commit('workBook/setToolAction', 'zoomIn');
    },

    setZoomOut() {
      this.$store.commit('workBook/setToolAction', 'zoomOut');
    },

    setDraw() {
      this.$store.commit('workBook/setMode', modesEnum.DRAW);
      this.$store.commit('workBook/setSubMode', subModesEnum.BRUSH);
    },
  },
});
</script>

<style lang="scss">

</style>