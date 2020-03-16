<template>
  <div class="task-item-links">
    <p v-if="task.links">Links {{ task.links.length }} <add-task-link :task="task"></add-task-link></p>
    <v-list dense>
      <draggable
        v-model="task.links"
        :move="changeOrder"
        :group="{ name: 'itemLinks', pull: 'clone', put: true }"
        :clone="cloneLink"
        @add="addCloneLink">
        <v-list-item
          v-for="link of task.links"
          :key="'link-' + link.id"
          dense
          class="mb-1"
          >
          <v-list-item-avatar v-if="link.favIconUrl" size="20">
            <v-img :src="link.favIconUrl"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>
            <a :href="link.url">{{ link.title && link.title.length > 0 ? link.title : link.url }}</a>
          </v-list-item-title>
          <v-btn dense icon @click="openSidebar(link.url, true)"><v-icon small>mdi-open-in-new</v-icon></v-btn>

          <v-list-item-action>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  icon
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <!-- Open tab -->
                <v-list-item :href="link.url">
                  <v-list-item-content>
                    <v-list-item-title>Open Tab</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon small>mdi-tab-plus</v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <!-- Open sidebar -->
                <v-list-item @click="openSidebar(link.url, true)">
                  <v-list-item-content>
                    <v-list-item-title>Open Workalong</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon small>mdi-open-in-new</v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <!-- Edit -->
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Edit title</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon small>mdi-pencil</v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <!-- Delete -->
                <v-list-item @click="deleteLink(link.id)">
                  <v-list-item-content>
                    <v-list-item-title>Delete link</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon small color="error">mdi-delete</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </draggable>
    </v-list>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import * as draggable from 'vuedraggable';

/* App components */
import AddTaskLink from './AddTaskLink.vue';

/* Models */
import { IBasePayload, ITask, IOpenSidebar, IUpdateTaskLinks, ITaskLink } from '@/types';

export default Vue.extend({
  name: 'TaskItemLinks',
  props: ['taskId'],
  components: {
    draggable,
    AddTaskLink,
  },
  data() {
    return {
      //
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      user: 'user/user',
      tasks: 'tasks/getTasks',
    }),
    task(): ITask {
      return this.tasks.find((task: ITask) => {
        return task.id === this.taskId;
      }) as ITask;
    },
  },

  methods: {
    changeOrder(ev: any): void {
      const linksArr = [...this.task.links];
      const payload: IUpdateTaskLinks = {
        vm: this,
        user: this.user,
        taskId: this.task.id as string,
        links: linksArr,
      };
      this.$store.dispatch('tasks/updateTaskLinks', payload);
    },

    cloneLink(item: any): ITaskLink {
      const newItem: ITaskLink = JSON.parse(JSON.stringify(item));
      newItem.id = undefined;
      return newItem;
    },

    addCloneLink(ev: any): void {
      const duplicate = this.task.links.find((link: ITaskLink, index: number) => {
        return link.url === this.task.links[ev.newIndex].url && index !== ev.newIndex;
      });
      if (!duplicate) {
        this.changeOrder(true);
      } else {
        // Show snackbar warning that it's a duplicate TODO
      }
    },

    deleteLink(linkId: string): void {
      const linksArr = [...this.task.links];
      const payload: IUpdateTaskLinks = {
        vm: this,
        user: this.user,
        taskId: this.task.id as string,
        links: linksArr,
        deleteId: linkId,
      };
      this.$store.dispatch('tasks/updateTaskLinks', payload);
    },

    openSidebar(linkUrl: string, linkExternal: boolean): void {
      const payload: IOpenSidebar = {
        url: linkUrl,
        vm: this,
        env: this.env,
        external: linkExternal,
      };
      this.$store.dispatch('tasks/openSidebar', payload);
    },
  },
});
</script>

<style lang="scss">
.task-item-links {
  .v-list {
    padding: 0;
    .v-list-item {
      padding: 0;
      .v-list-item__action {
        margin: 0;
      }
      .v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child),
      .v-application--is-ltr .v-list-item__avatar:last-of-type:not(:only-child),
      .v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child){
        margin-left: 0;
      }
    }
  }

}

</style>
