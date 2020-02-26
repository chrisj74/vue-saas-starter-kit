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
                  prepend-icon="fas fa-envelope"
                  type="email"
                  v-model="email"
                />

                <v-text-field
                  :append-icon="showPw ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="fas fa-lock"
                  :type="showPw ? 'text' : 'password'"
                  v-model="password"
                  @keyup.enter="onSignup"
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
                  <div >{{ userError.message }} <br> Already have an account?
                    <router-link :to="{ path: 'login' }">Login now</router-link>
                  </div>
                </slot>
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="onSignup" :disabled="!password || !email">Sign up with email</v-btn>
            </v-card-actions>

            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <p style="text-align: center;">(or <router-link :to="{ path: 'login' }">Login now</router-link>)</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
  <!-- <div id="login">
    <div class="layout-padding">
      <div class="mid-bg"></div>
      <div class="login-card shadow-4 bg-white">
        <h5 class="login-title">REGISTER</h5>
        <div class="row gutter-md">
          <div class="col-xs-12">
            <q-input float-label="Email" type="email" v-model="email"/>
          </div>
          <div class="col-xs-12">
            <input
              type="password"
              float-label="Password"
              v-model="password"
              ref="pw"
              @keyup.enter="onSignup"
            />
          </div>
        </div>
        <div v-if="userError" class="error-message">
          <div type="negative" class="q-mb-sm" icon="mdi-alert">{{ userError.message }} <br> Already have an account?
            <a href="/login">Login now</a></div>
        </div>
        <div class="text-center" style="margin-top: 30px">
          <p>
            <button color="primary" @click="onSignup">
              <span v-if="!loading">SIGN UP WITH EMAIL</span>
            </button>
          </p>
          <p>OR</p>
          <p>
            <social-sign-in></social-sign-in>
          </p>
          <p>Already have an account? <a href="/login">Login</a>.</p>
        </div>
      </div>
    </div>
  </div> -->
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
      email: '',
      password: '',
      showPw: false,
    };
  },
  mounted() {
    this.$store.dispatch('user/setUserError', null);
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
    onSignup() {
      const payload: ILoginData = {
        email: this.email,
        password: this.password,
        vm: this as Vue,
      };
      this.$store.dispatch('user/signUserUp', payload);
    },
  },
  watch: {
    user(value: any) {
      if (value !== null && value !== undefined) {
        this.$router.push('/');
      }
    },
  },
});
</script>
<style lang="scss">

</style>