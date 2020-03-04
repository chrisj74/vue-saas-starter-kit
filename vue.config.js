module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.ts',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    popup: {
      entry: 'src/extension/popup.ts',
      template: 'src/extension/popup.html',
      filename: 'popup.html',
      title: 'Popup'
    },
    sidebar: {
      entry: 'src/extension/sidebar.ts',
      template: 'src/extension/sidebar.html',
      filename: 'sidebar.html',
      title: 'Sidebar'
    }
  }
}