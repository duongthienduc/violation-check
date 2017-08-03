const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');
var CSS_DIR = path.resolve(__dirname, 'public/assets/css');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'assets/js/bundle.[chunkhash].js'
    },
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
    devtool: 'cheap-module-source-map',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([
            {
                from: 'public',
                ignore: [
                    // Doesn't copy any files with a css extension    
                    '*.css',
                ],
            }
        ]),
        new HtmlWebpackPlugin({
            hash: false,
            inject: true,
            template: 'my-index.ejs'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        }),
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin({
			filename: "assets/css/app.[chunkhash].css",
			disable: false,
			allChunks: true
		})
    ],
    resolve: {
        extensions: [ '.js', '.jsx' ]
    }
};

module.exports = config;
