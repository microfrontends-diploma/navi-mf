const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "andy-inc",
    projectName: "navi-mf",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    resolve: {
      ...defaultConfig.resolve,
      alias: {
        ...defaultConfig.resolve?.alias,
        src: path.resolve(__dirname, "src"),
      },
    },
    externals: ["@microfrontends-diploma/shared-code", "axios", "single-spa-react", "@mui/icons-material", "@mui/material"]
  });
};
