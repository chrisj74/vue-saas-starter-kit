<template>
  <v-dialog
      v-model="dialog"
      width="500"
    >
    <template v-slot:activator="{ on }">
      <v-btn
        color="red lighten-2"
        dark
        v-on="on"
      >
        Add link
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="white"
        flat
        dense
      >
        <v-toolbar-title>Add New Link</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Link title"
            name="title"
            type="text"
            v-model="newTaskLink.title"
          />
          <v-text-field
            label="Link address"
            name="url"
            type="text"
            v-model="newTaskLink.url"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="addTaskLink()" :disabled="!newTaskLink.url">Add Link</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { ITask, ITaskLink, IUpdateTaskLinks } from '@/types';

export default Vue.extend({
  name: 'AddTaskLink',

  props: ['task'],

  data() {
    return {
      dialog: false,
      newTaskLink: {
        title: '',
        url: '',
        favIconUrl: '',
        modified: new Date(),
      } as ITaskLink,
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
  },

  methods: {
    addTaskLink(): void {
      this.newTaskLink.modified = new Date();
      const linksArr = [...this.task.links];
      linksArr.unshift(this.newTaskLink);
      const payload: IUpdateTaskLinks = {
        vm: this,
        user: this.user,
        taskId: this.task.id,
        links: linksArr,
      };
      this.$store.dispatch('tasks/updateTaskLinks', payload)
        .then((resp) => {
          this.closeDialog();
        })
        .catch((error) => {
          console.error('Error adding new link');
        });
    },

    closeDialog() {
      this.newTaskLink = {
        url: '',
        title: '',
        favIconUrl: '',
        modified: new Date(),
      };
      this.dialog = false;
    },
  },
});
</script>
