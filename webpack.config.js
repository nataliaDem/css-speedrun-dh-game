const webpack = require('webpack');

module.exports = {
    entry: {
        player: ['./src/js/jquery.js', './src/js/common.js', './src/js/constants.js', './src/js/main.js', './src/js/game.js' ],
        admin: ['./src/js/jquery.js', './src/js/common.js', './src/js/constants.js', './src/js/main.js', './src/js/admin.js' ]
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}