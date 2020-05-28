<template>
  <v-app id="vApp">
    <v-navigation-drawer
      disable-resize-watcher
      v-model="leftDrawerOpen"
      app
      :mobile-break-point="768"
      :clipped="$vuetify.breakpoint.mdAndUp"
      >
      <v-list dense>
        <!-- HOME -->
        <v-list-item link to="'/index.html#/" target="_blank">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- WORK BOOKS -->
        <v-list-item link to="'/index.html#/workbooks" target="_blank">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ appStrings.TASK }} Work Books</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- NOTE BOOKS -->
        <v-list-item link to="'/index.html#/notebooks" target="_blank">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ appStrings.TASK }} Note Books</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- LOGIN/OUT -->
      <template v-slot:append>
        <div class="pa-2" v-if="user">
          <v-btn block @click="onLogout()" color="red lighten-2" dark>Logout <v-icon dark right>mdi-power-standby</v-icon></v-btn>
        </div>
        <div class="pa-2" v-else>
          <v-btn block @click="onLogin()" dark>Login <v-icon dark right>mdi-power-standby</v-icon></v-btn>
        </div>
      </template>

    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      app
      color="white"
      light
      height="40"
      >
      <v-app-bar-nav-icon @click.stop="toggleLeftDawer()" />
      <v-toolbar-title><v-img src="@/assets/learnalongo-logo-purple.png" max-width="115px"></v-img></v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon @click="closePopup()">mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
      >
        <div v-if="user">
          <v-card>
            <v-tabs
              v-model="tab"
              background-color="primary"
              dark
              @change="changeTab()"
            >
              <v-tab
                v-for="item in items"
                :key="item.id"
              >
                {{ item.tab }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="(item) in items"
                :key="item.tab"
              >
                <v-card flat v-if="item.id === 'recent'" class="mb-3">
                  <v-card-text>
                    <div v-if="noteBooks && workBooks">
                      <!-- NOTE BOOKS -->
                      <div v-if="noteBooks.length > 0">
                        <v-list elevation="2">
                          <v-subheader>Recent Note Books:</v-subheader>
                          <template v-for="(noteBook, noteIndex) in noteBooks">
                            <v-list-item v-if="noteIndex < 5" :key="noteBook.id" @click="openNote(noteBook.id)">
                              <v-list-item-title>{{ noteBook.title }}</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-list>
                      </div>

                      <!-- WORK BOOKS -->
                      <div v-if="workBooks.length > 0">
                        <v-list elevation="2">
                          <v-subheader>Recent Work Books:</v-subheader>
                          <template v-for="(workBook, workBookIndex) in workBooks">
                            <v-list-item v-if="workBookIndex < 5" :key="workBook.id" @click="openWorkBook(workBook.id)">
                              <v-list-item-title>{{ workBook.title }}</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-list>
                      </div>
                    </div>
                    <div v-else>
                      <p>No Recent Note Books or Work Books found.</p>
                    </div>
                  </v-card-text>
                </v-card>
                <v-card flat v-if="item.id === 'current'">
                  <v-card-text v-if="filteredNoteBooks && filteredWorkBooks">
                    <!-- PAGE MATCHES -->
                    <div v-if="filteredNoteBooks.length > 0 || filteredWorkBooks.length > 0">
                      <!-- NOTE BOOKS -->
                      <div v-if="filteredNoteBooks.length > 0">
                        <v-list elevation="2" dense>
                          <v-subheader>Note Books for this page:</v-subheader>
                          <v-list-item v-for="noteBook in filteredNoteBooks" :key="noteBook.id">
                            <v-list-item-title>{{ noteBook.title }}</v-list-item-title>
                            <v-btn
                              dense
                              icon
                              @click="openNote(noteBook.id)">
                              <v-icon small>mdi-view-split-vertical</v-icon>
                            </v-btn>

                            <v-list-item-action>
                              <v-menu offset-y :close-on-click="true">
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
                                  <v-list-item :href="'/index.html#/notebook/' + noteBook.id" target="_blank">
                                    <v-list-item-content>
                                      <v-list-item-title>Open New Tab</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                      <v-icon small>mdi-tab-plus</v-icon>
                                    </v-list-item-icon>
                                  </v-list-item>
                                  <!-- Open sidebar -->
                                  <v-list-item @click.stop="openNote(noteBook.id)">
                                    <v-list-item-content>
                                      <v-list-item-title>Split Learnalong</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                      <v-icon small>mdi-view-split-vertical</v-icon>
                                    </v-list-item-icon>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </div>

                      <!-- WORK BOOKS -->
                      <div v-if="filteredWorkBooks.length > 0">
                        <v-list elevation="2" dense>
                          <v-subheader>Work Books for this page:</v-subheader>
                          <v-list-item v-for="workBook in filteredWorkBooks" :key="workBook.id" @click="openWorkBook(workBook.id)">
                            <v-list-item-title>{{ workBook.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>
                    </div>
                    <div v-else>
                      <p>No Note Books or Work Books found for this page.</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>


            <v-card-actions>
              <v-spacer />
              <v-btn @click="newNote()">New Note Book</v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div v-else>
          <home-auth></home-auth>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

/* External libs */
import * as Bowser from 'bowser';

/* App components */
import HomeAuth from '@/components/home/HomeAuth.vue';

/* Models */
import { appStrings } from '@/utils';
import { IBasePayload, IExtensionSidebarState, IEnvState, EnvPlatformsEnum, IEnvBrowser, INoteBook, IWorkBook  } from '@/types';

export default Vue.extend({
  name: 'ExtensionPopup',
  components: {
    HomeAuth,
  },
  data: () => ({
    appStrings,
    EnvPlatformsEnum,
    tab: null,
    items: [
      {
        tab: 'Recent',
        id: 'recent',
      },
      {
        tab: 'This Page',
        id: 'current',
      },
    ],
  }),
  mounted() {
    if (this.user && !this.tasks) {
      const payload: IBasePayload = {
        user: this.user,
      };
      /* DISPATCH */
    }
    if (this.filteredNoteBooks && this.filteredNoteBooks.length > 0) {
      console.log('mounted has filtered');
      this.tab = 1;
    }
    if (this.filteredWorkBooks && this.filteredWorkBooks.length > 0) {
      this.tab = 1;
    }
  },
  computed: {
    ...mapGetters({
      loading: 'base/getLoading',
      error: 'base/getError',
      extension: 'base/getExtension',
      env: 'base/getEnv',
      user: 'user/user',
      authSet: 'user/getAuthSet',
      workBooks: 'workBook/getWorkBooks',
      noteBooks: 'noteBook/getNoteBooks',
    }),
    leftDrawerOpen: {
      get() {
        return this.$store.getters['base/getLeftDrawerOpen'];
      },
      set(val) {
        this.$store.commit('base/setLeftDrawerOpen', val);
      },
    },
    filteredNoteBooks() {
      if (this.noteBooks) {
        return this.noteBooks.filter((noteBook: INoteBook) => {
          return noteBook.connectedUrl === this.extension.currentTabUrl;
        });
      } else {
        return [];
      }
    },
    filteredWorkBooks() {
      if (this.workBooks) {
        return this.workBooks.filter((workBook: IWorkBook) => {
          return workBook.connectedUrl === this.extension.currentTabUrl;
        });
      } else {
        return [];
      }
    },
  },
  created() {
    const browser = Bowser.getParser(window.navigator.userAgent);

    this.$store.dispatch('base/setExtensionId', window.chrome.runtime.id);
    const envPayload: IEnvState = {
      platform: EnvPlatformsEnum.EXTENSION,
      browser: browser.getBrowser() as IEnvBrowser,
    };
    this.$store.commit('base/setEnv', envPayload);

    /* GET CURRENT URL */
    const vm: Vue = this;
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any) {
      console.log('current url=', tabs[0].url);
      vm.$store.commit('base/setExtensionCurrentTabUrl', tabs[0].url);
    });


    /* Listen for window update */
    /* Listeners */
    window.chrome.runtime.onMessage.addListener( function(response: any, sender: any, sendResponse: any) {
      // ADD listeners
    });
  },
  methods: {
    changeTab() {
      console.log(this.tab);
    },

    newNote() {
      const vm = this;
      window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any) {
        window.chrome.tabs.sendMessage(tabs[0].id, {type: 'newNote'}, function(response: any) {
          // deal with response if any
          vm.closePopup();
        });
      });
    },

    openNote(noteId: string) {
      const vm = this;
      window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any) {
        window.chrome.tabs.sendMessage(tabs[0].id, {type: 'openNote', noteId}, function(response: any) {
          // deal with response if any
          vm.closePopup();
        });
      });
    },

    openWorkBook(workBookId: string) {
      const vm = this;
      window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any) {
        window.chrome.tabs.sendMessage(tabs[0].id, {type: 'openWorkBook', workBookId}, function(response: any) {
          // deal with response if any
          vm.closePopup();
        });
      });
    },

    closePopup() {
      window.close();
    },

    toggleLeftDawer() {
      this.$store.dispatch('base/toggleLeftDrawerOpen');
    },
  },

  watch: {
    user(value: any) {
      if (value !== null && value !== undefined && !this.tasks) {
        const payload: IBasePayload = {
          user: this.user,
        };
        /* DISPATCH */
      }
    },
    filteredNoteBooks: {
      handler(oldVal, newVal) {
        if (this.filteredNoteBooks && this.filteredNoteBooks.length > 0) {
          console.log('watch has filtered');
          this.tab = 1;
        }
      },
      deep: true,
    },
    filteredWorkBooks: {
      handler(oldVal, newVal) {
        if (this.filteredWorkBooks && this.filteredWorkBooks.length > 0) {
          this.tab = 1;
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
#vApp {
  width: 500px;
}
</style>
