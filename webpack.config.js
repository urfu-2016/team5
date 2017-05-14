const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const config = require('config');

module.exports = {
    context: path.join(__dirname, '/views'),
    entry: {
        header: './blocks/header/header',
        mainPage: './pages/mainPage/mainPage',
        questsAll: './pages/questsAll/questsAll',
        questId: './pages/questsId/quest',
        createQuest: './pages/createQuest/createQuest'
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
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[name].[ext]',
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css'),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        jquery: 'jQuery'
    },
    stats: {
        children: false
    }
};

if (config.mode === 'production') {
    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    );

    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );

    module.exports.devtool = 'cheap-module-sourece-map';
}
