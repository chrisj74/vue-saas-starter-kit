import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as axios from 'axios';
import uuid from 'uuidv4';

/* Models */
import { IBasePayload, ITask, IAddTask } from '@/types';

export const setTasks = (state: any, payload: IBasePayload) => {
  return new Promise((resolve, reject) => {
    firebase
        .firestore()
        .collection('users/' + payload.user.id + '/tasks/')
        .orderBy('modified', 'desc')
        .onSnapshot(function(querySnapshot) {
          const tasks: ITask[] = [];
          querySnapshot.forEach(function(doc) {
            tasks.push({
              id: doc.id,
              title: doc.data().title,
              profile: doc.data().profile,
              description: doc.data().description,
              modified: doc.data().modified.toDate(),
              publishId: doc.data().publishId,
            });
          });
          payload.vm.$store.commit('tasks/setTasks', tasks);
          resolve();
      });

  });
};

export const addTask = (state: any, payload: IAddTask) => {
  return new Promise((resolve, reject) => {
    const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
    userDoc.update({
      lastUpdated: new Date(),
    });

    userDoc
      .collection('tasks').add(payload.task)
      .then(function(docRef) {
        /*
        // Add deeper doc if needed
        docRef
          .collection('pages').add(payload.page)
            .then(function(pageRef) {

            });
        */
        resolve(docRef.id);
      })
      .catch(function(error) {
          console.error('Error adding document: ', error);
      });
  });
};
