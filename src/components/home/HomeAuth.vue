<template>
  <v-card>
    <v-toolbar
      color="primary"
      dark
      flat
      dense
      height="50"
    >
      <v-tabs
        v-model="tab"
        centered
        slider-color="yellow"
      >
        <v-tab
          :href="`#tab-1`"
        >
          Login
        </v-tab>
        <v-tab
          :href="`#tab-2`"
        >
          Register
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <!-- Login -->
      <v-tab-item
        :value="`tab-1`"
      >
        <v-card flat>
          <login-form></login-form>

          <v-alert
            v-if="userError"
            color="error"
            border="top"
            type="error"
            text
            dense
          >
            <slot name="default">
              <div >{{ userError.message }} <br> Don't have an account?
                <a @click.prevent="tab = 'tab-2'" :href="{ path: 'register' }">Register now</a>
              </div>
            </slot>
          </v-alert>

          <v-card-text>
            <p style="text-align: center;">(No account?  )</p>
            <p class="forgotten-password" @click="showForgottenPassword()">Forgotten password?</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Register -->
      <v-tab-item
        :value="`tab-2`"
      >
        <v-card flat>
          <register-form></register-form>
          <v-card-text>
            <p style="text-align: center;">(Already have an account? <a @click.prevent="tab = 'tab-1'" :href="{ path: 'login' }">Login now</a>)</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import * as _ from 'lodash';

/* App components */
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

/* Models */
import { windowTypeEnum } from '@/types';

export default Vue.extend({
  name: 'HomeAuth',
  components: {
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      windowTypeEnum,
      tab: 'tab-1',
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      extension: 'base/getEextension',
      windowType: 'base/getWindowType',
      user: 'user/user',
      userError: 'user/getUserError',
    }),
  },

  methods: {
    showForgottenPassword() {
    // this.$q
    //   .dialog({
    //     title: 'Forgotten Password',
    //     message: 'Enter the password you used to create an account
    // and we\'ll send you an email with a link to reset your password.',
    //     prompt: {
    //       model: this.email,
    //       type: 'text' // optional
    //     },
    //     cancel: true,
    //     color: 'primary'
    //   })
    //   .onOk((forgottenEmail: any) => {
    //     this.$store.dispatch('user/forgottenPassword', forgottenEmail).then(() => {
    //       this.$q.notify({
    //         message: 'Check your email for instructions on how to reset your password.',
    //         color: 'positive',
    //         textColor: 'black',
    //         icon: 'mdi-email'});
    //     });
    //   });
    },
  },
});
</script>

<style lang="scss">

</style>
