// import '@fortawesome/fontawesome-free/css/all.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
import { UserVuetifyPreset } from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#2fb8ac',
        secondary: '#fad600',
        accent: colors.shades.black,
      } as Partial<UserVuetifyPreset>,
      dark: {
        primary: colors.blue.lighten3,
      } as Partial<UserVuetifyPreset>,
    },
  },
});
