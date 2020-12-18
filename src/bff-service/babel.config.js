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
  ]
};