module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: {
          node: 'current',
        },
        corejs: 3,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread'
  ],
};