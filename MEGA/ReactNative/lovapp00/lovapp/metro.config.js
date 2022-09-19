/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('@dynatrace/react-native-plugin/lib/dynatrace-transformer'),
  },
  reporter: require("@dynatrace/react-native-plugin/lib/dynatrace-reporter"),
};

// module.exports = {
// 	transformer: {
// 		babelTransformerPath: require.resolve('@dynatrace/react-native-plugin/lib/dynatrace-transformer')
    
// 	},
// 	reporter: require("@dynatrace/react-native-plugin/lib/dynatrace-reporter")
// };
