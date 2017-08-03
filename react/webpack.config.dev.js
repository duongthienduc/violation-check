const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src');
var CSS_DIR = path.resolve(__dirname, 'public/assets/css');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'assets/js/bundle.js'
    },
    devtool: 'source-map',
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel-loader'
            },
            {
                test: /\.css$/,
                include : CSS_DIR,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
			filename: "assets/css/app.css",
			disable: false,
			allChunks: true
		}),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'my-index.ejs'
        })
    ]
};

module.exports = config;
