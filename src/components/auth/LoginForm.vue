<template>
  <div class="login-form">
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
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="onSignin" :disabled="!password || !email">Login</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
// import SocialSignIn from '../../components/user/SocialSignIn.vue';
import { mapGetters } from 'vuex';
import Vue from 'vue';
import { IUser, ILoginData } from '../../types';

export default Vue.extend({
  name: 'LoginForm',
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
    }),
  },
  methods: {
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
  .login-form{
    min-width: 300px;
  }
  .forgotten-password {
    text-align: center;
    cursor: pointer;
  }
</style>