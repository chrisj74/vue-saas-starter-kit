import firebase from 'firebase';
import auth from 'firebase/auth'; // not used but needed
import config from './firebase.json';
import Vue from 'vue';
import router from '../router';
import store from '../store';

export const fireApp = firebase.initializeApp(config);

export const AUTH = fireApp.auth();

export const FirebaseAutoLogin = (vm: Vue) => {
    AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        /* Set user */
        const userObj = {
          lastUpdated: new Date(),
          lastLoggedIn: new Date(),
          sessions: 0,
          images: [],
        };
        const payload = {
          user,
          query: vm.$router.currentRoute.query,
          vm: vm as Vue,
        };
        const userDoc = await firebase
          .firestore()
          .collection('users/')
          .doc(user.uid);
        await userDoc.get().then(async (docSnapshot: any) => {
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
                console.log('error', error);
              });
          } else {
            userObj.images = [];
            userObj.sessions = 1;
            await userDoc.set(userObj);
          }
          await vm.$store.dispatch('user/autoSignIn', payload);
        });
      } else {
        if (vm.$router.currentRoute.path !== '/login' && vm.$router.currentRoute.path !== '/register') {
          router.push('/login' + '?redirect=' + vm.$router.currentRoute.path).catch((err) => {
            console.error('Router error:', err);
          });
        }

        await store.dispatch('user/setAuth', true); // Let the app know auth complete
      }
    });
};
