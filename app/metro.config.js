const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watching by excluding unnecessary directories
config.watchFolders = [__dirname];

// Block nested node_modules from being watched
config.resolver.blockList = [
  /.*\/node_modules\/.*\/node_modules\/.*/,
];

// Reduce watcher overhead
config.watcher = {
  ...config.watcher,
  healthCheck: {
    enabled: true,
  },
  watchman: {
    deferStates: ['hg.update'],
  },
};

module.exports = config;

