const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const alias = {
  '@assets': path.resolve(__dirname, 'src/assets'),
};

const config = {
  resolver: {
    extraNodeModules: new Proxy(alias, {
      get: (target, name) =>
        name in target
          ? target[name]
          : path.join(__dirname, `node_modules/${name}`),
    }),
  },
  watchFolders: [
    path.resolve(__dirname, 'src/assets'),
  ],
};

module.exports = mergeConfig(defaultConfig, config);
