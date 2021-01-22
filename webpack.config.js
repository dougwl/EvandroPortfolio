module.exports = {
    entry: {
      app: './src/js/App/app.js'
    },
    mode: 'development', //production | development
    output: {
      path: `${__dirname}/dist`,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            // `.swcrc` can be used to configure swc
            loader: "swc-loader"
          }
        }
      ]
    },
    watch: true,
    watchOptions: {
      ignored: /(node_modules|Libraries|Extras|include)/
    }
    /* externals: {
      // require("jquery") is external and available
      //  on the global var jQuery
      "jquery": "jQuery",
      "$": "jQuery"
    } */
};