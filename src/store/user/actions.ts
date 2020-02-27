import { IUser, ICreds, ILoginData } from '@/types';

import Vue from 'vue';
import { AUTH } from '../../boot/firebase';
import * as firebase from 'firebase';

// const vm = this as unknown as Vue;

export const setUserError = (state: any, payload: any) => {
  state.commit('setError', payload);
};

export const setAuth = (state: any, payload: boolean) => {
  state.commit('setAuth', payload);
};

export const setUserNull  = (state: any) => {
  state.commit('setUser', null);
};

export const signUserUp = (state: any, payload: ILoginData) => {
  payload.vm.$store.commit('base/setLoading', true);
  payload.vm.$store.commit('base/clearError', null);
  payload.vm.$store.commit('user/setError', null);
  AUTH.createUserWithEmailAndPassword(payload.email, payload.password)
    .then(
      (user: any) => {
        payload.vm.$store.commit('base/setLoading', false);
        const newUser: IUser = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
        };
        payload.vm.$store.commit('user/setUser', newUser);
      },
    )
    .catch(
      (error) => {
        payload.vm.$store.commit('base/setLoading', false);
        payload.vm.$store.commit('user/setError', error);
        console.error(error);
      },
    );
};

export const signUserIn = (state: any, payload: ILoginData) => {
  payload.vm.$store.commit('base/setLoading', true);
  payload.vm.$store.commit('base/clearError');
  AUTH.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      AUTH.signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          (data) => {
            if (data && data.user) {
              payload.vm.$store.commit('base/setLoading', false);
              payload.vm.$store.commit('user/setError', null);
              const newUser: IUser = {
                id: data.user.uid as string,
                name: data.user.displayName as string,
                email: data.user.email as string,
                photoUrl: data.user.photoURL as string,
              };
              payload.vm.$store.commit('user/setUser', newUser);

              if (payload.redirect && payload.redirect.hasOwnProperty('redirect')) {
                const redirect: string = payload.redirect.redirect as string;
                payload.vm.$router.push(redirect);
              } else {
                payload.vm.$router.push('/');
              }
              payload.vm.$store.commit('user/setAuth', true);
            }

          },
        )
        .catch(
          (error) => {
            payload.vm.$store.commit('base/setLoading', false);
            payload.vm.$store.commit('user/setError', error);
            console.error('Sign in error: ', error);
          },
        );
    });
};

export const autoSignIn =  (state: any, payload: any) => {
  state.commit('setUser', {
    id: payload.user.uid,
    name: payload.user.displayName,
    email: payload.user.email,
    photoUrl: payload.user.photoURL,
  });

  if (payload.query.hasOwnProperty('redirect')
    && payload.vm.$router.currentRoute.path !== payload.query.redirect
  ) {
    payload.vm.$router.push(payload.redirect.redirect);
  } else if (
    payload.vm.$router.currentRoute.path === '/login'
    || payload.vm.$router.currentRoute.path === 'register'
  ) {
    payload.vm.$router.push('/');
  }
  state.commit('setAuth', true);
};

export const logout = ( state: any, vm: Vue ) => {
  // const vm = this as any;
  AUTH.signOut();
  vm.$store.commit('user/setUser', null);
  vm.$store.commit('user/setAuth', true ); // Let the app know auth complete
  vm.$router.push('/login').catch((err) => {
    console.error('Error:', err);
  });
};
