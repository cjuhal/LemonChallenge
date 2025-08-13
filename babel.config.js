module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@assets': './src/assets',
        '@components': './src/components',
      },
    }], 
    ['react-native-worklets/plugin']
  ],
};
