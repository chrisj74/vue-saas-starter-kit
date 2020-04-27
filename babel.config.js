module.exports = {
  presets: [[
    '@vue/cli-plugin-babel/preset',{useBuiltIns: 'entry',polyfills: [
      'es6.promise',
      'es6.symbol'
    ]}
  ]],
  // plugins: [
  //   [
  //     "@babel/transform-runtime", {
  //       "polyfill": false,
  //       "regenerator": false
  //     }
  //   ]
  // ],
}
