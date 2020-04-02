<template>
    <v-card>
      <v-toolbar
        color="white"
        flat
        dense
      >
        <v-toolbar-title>Share Task</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox
            v-model="members"
            filled
            chips
            color="blue-grey lighten-2"
            label="Enter email and hit return"
            item-text="name"
            item-value="name"
            multiple
            deletable-chips
            hide-selected
          >
        </v-combobox>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="shareTask()">Share Task</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* Models */
import { ITask, IUpdateTask, taskTabTypesEnum, ITaskTabs, taskRolesEnum, IUser } from '@/types';
import { newTaskTabs } from '@/utils';

export default Vue.extend({
  name: 'ShareTask',
  props: ['task'],
  data() {
    return {
      dialog: false,
      members: null as unknown as string[],
      allMembers: [],
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      user: 'user/user',
    }),
  },

  methods: {
    shareTask() {
      console.log('members=');
      this.members.unshift(this.user.email);
      const task: ITask = JSON.parse(JSON.stringify(this.task));
      task.members = this.members;
      const payload: IUpdateTask = {
        user: this.user,
        task,
      };
      this.$store.dispatch('tasks/updateTask', payload);
      this.closeDialog();
    },

    closeDialog() {
      this.$emit('doClose');
    },
  },
  watch: {
    task: {
      handler(newVal, oldVal): void {
        if (!this.members) {
          this.members = [];
          this.task.members.forEach((member: string) => {
            if (member !== this.user.id) {
              this.members.push(member);
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
