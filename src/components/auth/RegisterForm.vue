<template>
  <div class="register-form">
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
  </div>
</template>

<script lang="ts">
// import SocialSignIn from '../../components/user/SocialSignIn.vue';
import { mapGetters } from 'vuex';
import Vue from 'vue';
import { IUser, ILoginData } from '../../types';

export default Vue.extend({
  name: 'RegisterForm',
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
.register-form {
  min-width: 300px;
}
</style>