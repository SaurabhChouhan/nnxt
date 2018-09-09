import path from 'path';
import webpack from 'webpack'
import CompressionPlugin from 'compression-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const buildPath = path.join(__dirname, 'server', 'public', 'js')

const config = {
    devtool: 'source-map',
    entry: {
        js: './client/client.js',
    },
    output: {
        path: buildPath,
        filename: 'app.bundle.7.js',
        publicPath: '/js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, 'client'),
                use: {
                    loader: 'babel-loader',
                    options: 'cacheDirectory=.babel_cache',
                },
            }, {
                test: /\.scss$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }, {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.woff/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
            {test: /\.woff2/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
            {test: /\.gif/, loader: 'url-loader?limit=10000&minetype=image/png'},
            {test: /\.ttf/, loader: 'file-loader'},
            {test: /\.eot/, loader: 'file-loader'},
            {test: /\.svg/, loader: 'file-loader?name=../svg/[hash].[ext]'}
        ],
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.2.js',
            minChunks(module) {
                return module.context &&
                    module.context.indexOf('node_modules') >= 0;
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './server/views/index-tmpl.mustache'),
            path: buildPath,
            excludeChunks: ['base'],
            filename: path.join(__dirname, './server/views/index.mustache'),
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        /*
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            allChunks: true
        }),
        new StyleExtHtmlWebpackPlugin({
            minify: true
        }),
        */
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};

export default config;