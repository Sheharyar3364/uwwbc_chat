module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './', // project root
          '@assets': './assets',
          '@screens': './screens',
          '@components': './components',
          '@navigation': './navigation',
        },
      },
    ],
  ],
};
