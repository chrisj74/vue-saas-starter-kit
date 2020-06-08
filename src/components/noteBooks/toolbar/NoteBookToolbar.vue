<template>
  <div class="flex-grow-1 d-flex justify-center">
    <div class="note-text-toolbar flex-grow-1 d-flex justify-center">
    </div>

    <!-- Extra menu -->
    <v-menu offset-y :close-on-click="true">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          icon
          dense
          fab
          small
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <!-- Close -->
        <v-list-item @click="removeSplit()" v-if="inIframe">
          <v-list-item-content>
            <v-list-item-title>Close</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon small>mdi-close</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <!-- Open tab -->
        <v-list-item :href="window.location.href" target="_blank" v-if="inIframe">
          <v-list-item-content>
            <v-list-item-title>Open In New Tab</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon small>mdi-tab-plus</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <!-- Export -->
        <v-list-item @click.stop="null">
          <v-list-item-content>
            <v-list-item-title>Export</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon small>mdi-download</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <!-- Delete -->
        <v-list-item @click.stop="showDeleteDialog = true">
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon small color="error">mdi-delete</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="showDeleteDialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Delete Notebook
        </v-card-title>

        <v-card-text>
          Are you sure? There is no undo, once this little fella is gone he's gone for good.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text
            @click="closeConfirmDelete()">
            Stop! I want to keep it
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteNoteBook()"
          >
            Go ahead and delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Libs */

/* App components */

/* Utils */
import { appStrings } from '@/utils';

export default Vue.extend({
  name: 'NoteBookToolbar',
  components: {  },
  data() {
    return {
      appStrings,
      window,
      showDeleteDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
      noteBook: 'noteBook/getNoteBook',
      settings: 'noteBook/getNoteBookSettings',
      inIframe: 'base/getInIframe',
    }),
  },
  mounted() {
    const vm = this;

  },
  methods: {
    removeSplit() {
      parent.postMessage({type: 'removeSplit'}, '*');
    },

    deleteNoteBook() {
      this.$store.dispatch('noteBook/deleteNoteBook', this.noteBook)
      .then(() => {
        this.closeConfirmDelete();
        this.$router.replace('/notebooks');
      });
    },

    closeConfirmDelete() {
      this.showDeleteDialog = false;
    },
  },
  watch: {
     //
  },
});
</script>

<style lang="scss">
.note-text-toolbar {
  margin-top: 5px;
}
</style>
