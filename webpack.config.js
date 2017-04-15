const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, '/views'),
    entry: {
        header: './blocks/header/header',
        mainPage: './pages/mainPage/mainPage'
    },
    output: {
        path: path.join(__dirname, '/public'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    externals: {
        jquery: 'jQuery'
    }
};
