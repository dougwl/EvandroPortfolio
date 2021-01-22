const { config } = require('@swc/core/spack')

module.exports = config({
    entry: {
        'web': __dirname + '/src/js/Custom/customizations.js',
    },
    output: {
        path: __dirname + '/dist'
    },
    module: {},
});