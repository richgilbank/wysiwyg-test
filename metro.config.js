const path = require('path');

// react-native >= 0.57

const extraNodeModules = {
  'react-native-cn-richtext-editor': path.resolve('/Users/richgilbank/Code/react-native-cn-richtext-editor'),
};
const watchFolders = [
  path.resolve('/Users/richgilbank/Code/react-native-cn-richtext-editor')
];

module.exports = {
  resolver: {
    extraNodeModules,
  },
  watchFolders
};
