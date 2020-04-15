<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="trelloAuth()">
          Authorise Trello
        </v-btn>
      </v-col>
    </v-row>
    <!-- <add-task></add-task> -->
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External components */
import axios from 'axios';

/* App components */
import AddTask from '@/components/tasks/AddTask.vue';
import TaskItem from '@/components/tasks/TaskItem.vue';

/* Models */
import { ITask, EnvPlatformsEnum, IOpenSidebar, ITaskLink } from '@/types';
import { appStrings } from '@/utils/app.strings';

declare global {
  interface Window {Trello: any; }
}

window.Trello = window.Trello;

export default Vue.extend({
  name: 'Settings',
  components: { },
  data() {
    return {
      trelloData: {
        key: null,
        token: null,
      }
    };
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
    }),
  },
  methods: {
    telloAuthSuccess(token: any) {
      this.trelloData.key = window.Trello.key();
      this.trelloData.token = window.Trello.token();
      axios.get('https://api.trello.com/1/members/me/boards', {
        params: {
          key: this.trelloData.key,
          token: this.trelloData.token,
        },
      }).then((resp: any) => {
        console.log(resp);
        this.getTrelloOrgs();
        this.getTrelloCards(resp.data[0].id);
      }).catch((error) => {
        console.error('error getting Trello boards:', error);
      });
    },

    getTrelloOrgs(id: string) {
      axios.get('https://api.trello.com/1/members/me/organsizations/' + id, {
        params: {
          key: this.trelloData.key,
          token: this.trelloData.token,
        },
      }).then((resp: any) => {
        console.log('orgs=', resp);
      }).catch((error) => {
        console.error('error getting Trello orgs:', error);
      });
    },

    getTrelloCards(id: string) {
      axios.get('https://api.trello.com/1/boards/' + id + '/cards', {
        params: {
          key: this.trelloData.key,
          token: this.trelloData.token,
        },
      }).then((resp: any) => {
        console.log('cards=', resp);
      }).catch((error) => {
        console.error('error getting Trello cards:', error);
      });
    },

    trelloAuthFail(error: any) {
      console.error('Error authenticating Trello:', error);
    },

    trelloAuth() {
      const payload = {
        name: appStrings.APP_NAME,
        type: 'popup',
        scope: {
          read: 'true',
          write: 'true' },
        expiration: 'never',
        success: this.telloAuthSuccess,
        error: this.trelloAuthFail,
        persist: false,
      };
      window.Trello.authorize(payload);
    },
  },
});
</script>

<style lang="scss">
.trello-iframe {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
</style>
