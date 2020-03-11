<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="task">
          <v-toolbar
            color="primary"
            dark
            flat
            dense
          >
            <v-toolbar-title>{{ task.title }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="openSidebar()">
                  <v-icon>
                    mdi-open-in-new
                  </v-icon>
                </v-btn>
              </template>
              <span>Open Workalong</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <div v-html="task.description"></div>
            <v-row>
              <v-col>

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <add-task></add-task>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* App components */
import AddTask from '@/components/tasks/AddTask.vue';

/* Models */
import { ITask, EnvPlatformsEnum, IOpenSidebar } from '@/types';

export default Vue.extend({
  name: 'Task',
  components: { AddTask },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
    task() {
      return this.$store.getters['tasks/getTaskById'](this.$router.currentRoute.params.id);
    },
  },
  methods: {
    openSidebar() {
      const payload: IOpenSidebar = {
        url: '/task/' + this.$router.currentRoute.params.id,
        vm: this,
        env: this.env,
        external: false,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
    },
  },
});
</script>
