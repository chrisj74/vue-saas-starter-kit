<template>
  <div class="d-flex justify-center">
    <div
      v-if="(!extensionInstalled && env.browser.name === 'Chrome' || env.browser.name !== 'Chrome')"
      class="extension-alert primary"
    >
      <v-row align="center" dense>
        <v-col class="shrink"><v-icon color="white" large>mdi-google-chrome</v-icon></v-col>
        <v-col class="grow" v-if="!extensionInstalled && env.browser.name === 'Chrome'">Learnalongo works best with the free Chrome extension</v-col>
        <v-col class="grow" v-if="env.browser.name !== 'Chrome'">Learnalongo works best with the free Chrome Browser</v-col>
        <v-col class="shrink" v-if="!extensionInstalled && env.browser.name === 'Chrome'">
          <v-btn small>Get Extension</v-btn>
        </v-col>
        <v-col class="shrink" v-if="env.browser.name !== 'Chrome'">
          <v-btn small :to="'https://www.google.com/chrome/'" target="_blank">Get Chrome</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import Vue from 'vue';

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'ExtensionAlert',
  data() {
    return {
      appStrings,
    };
  },
  computed: {
    ...mapGetters({
      extensionInstalled: 'base/getExtensionInstalled',
      env: 'base/getEnv',
      // leftDrawerOpen: 'base/getLeftDrawerOpen',
    }),
  },
  methods: {
    //
  },
});
</script>

<style lang="scss">
.extension-alert {
  position: fixed;
  bottom: 0;
  z-index: 999;
  border-radius: 4px;
  padding: 4px 16px;
  color: #fff;
  margin-bottom: 4px;
}
</style>