const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const config = require('config');

module.exports = {
    context: path.join(__dirname, '/views/pages'),
    entry: {
        questsId: './questsId/quests-id.js',
        questsAll: './questsAll/questsAll.js',
        layout: './layout.js'
    },
    output: {
        path: path.join(__dirname, '/public'),
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('stylesheets/[name].css'),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

if (config.mode === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            warnings: false
        })
    );
}
