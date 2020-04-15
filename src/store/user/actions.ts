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
              } else if (payload.vm.$router.currentRoute.path !== '/') {
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
  state.commit('setAuth', true);

  const userObj = {
    lastUpdated: new Date(),
    lastLoggedIn: new Date(),
    sessions: 0,
    images: [],
  };

  /* Update user record */
  const userDoc = firebase
    .firestore()
    .collection('users/')
    .doc(payload.user.uid);

  userDoc.get().then((docSnapshot: any) => {
    if (docSnapshot.exists) {
      userObj.sessions = docSnapshot.data().sessions
        ? docSnapshot.data().sessions + 1
        : 1;
      userObj.images = docSnapshot.data().images
        ? docSnapshot.data().images
        : [];
      userDoc
        .update(userObj)
        .then(() => {
          // console.log('updated sessions');
        })
        .catch((error) => {
          console.error('error', error);
        });
    } else {
      userObj.images = [];
      userObj.sessions = 1;
      userDoc.set(userObj);
    }
  })
  .catch((error: any) => {
    console.error('Problem accessing User data: ', error);
  });
};

export const logout = ( state: any, vm: Vue ) => {
  // const vm = this as any;
  AUTH.signOut();
  vm.$store.commit('user/setUser', null);
  vm.$store.commit('user/setAuth', true ); // Let the app know auth complete
  if (vm.$router.currentRoute.path !== '/') {
    vm.$router.push('/')
    .then(() => {
      vm.$store.commit('tasks/setTasks', null);
      vm.$store.commit('tasks/setTemplates', null);
    })
    .catch((err) => {
      console.error('Error:', err);
    });
  } else {
    vm.$store.commit('tasks/setTasks', []);
    vm.$store.commit('tasks/setTemplates', []);
  }
};
