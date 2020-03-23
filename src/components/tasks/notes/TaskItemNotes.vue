<template>
  <div class="task-item-notes">
    <p>NOTES</p>
    <div class="task-item-notes-editor">
      <tinymce-editor
        v-model="editorContent"
        v-if="editorConfig"
        class="editor"
        api-key="p0igcqysw2jkny4v7wki9qyg6p05lplhpctohfurcbsjc7dp"
        :init="editorConfig">
      </tinymce-editor>
    </div>

  </div>
</template>

<script lang="ts">
// @ is an alias to /src
/* Libs */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import * as draggable from 'vuedraggable';
import * as _ from 'lodash';
import Editor from '@tinymce/tinymce-vue';

/* Models */
import { IBasePayload, ITask, IOpenSidebar, IUpdateTaskLinks, ITaskLink,
  windowTypeEnum, IUpdateTask, ITaskNotesObj } from '@/types';

export default Vue.extend({
  name: 'TaskItemNotes',
  props: ['taskId'],
  components: {
    draggable,
    'tinymce-editor': Editor,
  },

  data() {
    return {
      windowTypes: windowTypeEnum,

      editorContent: 'Loading' as string,
      editorCommits: 0,
      editorConfig: null as any,
    };
  },

  mounted() {
    this.editorConfig = {
      plugins: 'wordcount, table, media, emoticons, lists, link, code, image',
      inline: false,
      // fixed_toolbar_container: '#planToolbar',
      menubar: 'edit insert format table',
      draggable_modal: true,
      toolbar: 'alignleft aligncenter alignright | styleselect | bold italic emoticons | table media image | link',
      contextmenu: 'link image imagetools table',
      mobile: {
        theme: 'mobile',
        plugins: 'lists, autolink',
        toolbar: 'undo, bold, italic, styleselect',
      },
      relative_urls : false,
      remove_script_host : true,
    };
  },

  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      env: 'base/getEnv',
      windowType: 'base/getWindowType',
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
    updateTask: _.debounce(function() {
      const task: ITask = JSON.parse(JSON.stringify(this.task));
      const payload: IUpdateTask = {
        user: this.user,
        task,
      };
      this.editorCommits++;
      payload.task.notes = {
        commit: this.editorCommits,
        content: this.editorContent,
      };
      this.$store.dispatch('tasks/updateTask', payload);
    }, 1000),

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

  watch: {
    task: {
      handler(newVal, oldVal): void {

        if (this.task.notes) {
          console.log('component commit=', this.editorCommits);
          console.log('inbound commit=', this.task.notes.commit);
        }

        if (this.task.notes && this.editorCommits < this.task.notes.commit) {
          const notes: ITaskNotesObj = JSON.parse(JSON.stringify(this.task.notes));
          this.editorContent = notes.content;
          this.editorCommits = notes.commit;
        } else if (!this.task.notes) {
          /* No stored notes obj set to empty string */
          this.editorContent = '';
        }
      },
      immediate: true,
      deep: true,
    },

    editorContent: {
      handler(oldText, newText) {
        this.updateTask();
      },
    },
  },
});
</script>

<style lang="scss">
.task-item-notes-editor {
  min-height: 500px;
  display: flex;
  align-items: stretch;
  textarea {
    width: 0;
  }
  .tox-tinymce {
    flex-grow: 2;
  }
}

</style>
