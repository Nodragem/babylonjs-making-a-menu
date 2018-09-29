The lines:

    optimization: {
       splitChunks: {
          chunks: 'all'
       }
    },

does not seem to work as I expected, the webpack-dev-server is still re-compiling all the libraries/modules when I change my code.
