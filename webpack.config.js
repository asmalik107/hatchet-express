var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event;
var PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'dist'),
    style: path.join(__dirname, '/app/css/app.css')
};


var common = {
    entry: {
        app: PATHS.app + '/main.js',
        style: PATHS.style
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: pkg.name,
            appMountId: 'app',
            inject: false
        })
    ]
};


if (TARGET === 'dev-server' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        module: {
            loaders: [
                {
                    // Test expects a RegExp! Note the slashes!
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    // Include accepts either a path or an array of paths.
                    include: PATHS.app
                }
            ]
        }

    });
}

if (TARGET === 'build' || TARGET === 'stats') {
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies)
        },
        module: {
            loaders: [
                // Extract CSS during build
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    include: PATHS.app
                }
            ]
        },
        plugins: [
            new CleanPlugin([PATHS.build]),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]
    });
}
