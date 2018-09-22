const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var publicPath = path.resolve(__dirname, 'public', 'dist')

module.exports = {
    entry: {
        client: './client/client.js'
    },
    output: {
        filename: 'js/[name].[chunkhash].bundle.js',
        path: publicPath,
        chunkFilename: 'js/[name].[chunkhash].bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {minimize: true}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([publicPath]),
        new HtmlWebpackPlugin({
            template: "./server/views/index-tmpl.mustache",
            filename: path.resolve(publicPath, 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }

};