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
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  v-model="email"
                />

                <v-text-field
                  :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  :type="showPw ? 'text' : 'password'"
                  v-model="password"
                  @keyup.enter="onSignin"
                  @click:append="showPw = !showPw"
                />
              </v-form>
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
                    <router-link :to="{ path: 'register' }">Register now</router-link>
                  </div>
                </slot>
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="onSignin" :disabled="!password || !email">Login</v-btn>
            </v-card-actions>

            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <p style="text-align: center;">(or <router-link :to="{ path: 'register' }">Register now</router-link>)</p>
              <p class="forgotten-password" @click="showForgottenPassword()">Forgotten password?</p>
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
import { IUser, ILoginData } from '../../types';

export default Vue.extend({
  components: {
    // SocialSignIn
  },
  data() {
    return {
      email: '' as string,
      password: '' as string,
      showPw: false,
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

    onSignin() {
      const payload: ILoginData = {
        vm: this as Vue,
        email: this.email as string,
        password: this.password as string,
        redirect: this.$router.currentRoute.query,
      };
      this.$store.dispatch('user/signUserIn', payload);
    },
  },
  mounted() {
    this.$store.dispatch('user/setUserError', null);
  },
});
</script>

<style lang="scss">

</style>