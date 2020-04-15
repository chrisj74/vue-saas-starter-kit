<template>
<v-content>
    <v-container
      class="fill-height"
      fluid
      v-if="authSet"
      >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>

            <register-form></register-form>

            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <p style="text-align: center;">(or <router-link :to="{ path: 'login' }">Login now</router-link>)</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
// import SocialSignIn from '../../components/user/SocialSignIn.vue';
import { mapGetters } from 'vuex';
import Vue from 'vue';

import RegisterForm from '@/components/auth/RegisterForm.vue';

import { IUser, ILoginData } from '../../types';

export default Vue.extend({
  components: {
    RegisterForm,
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      authSet: 'user/getAuthSet',
      userError: 'user/getUserError',
      // leftDrawerOpen: 'base/getLeftDrawerOpen',
    }),
  },
  methods: {

  },
});
</script>
<style lang="scss">

</style>