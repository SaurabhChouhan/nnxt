import path from 'path';
import webpack from 'webpack'
import CompressionPlugin from 'compression-webpack-plugin'

const config = {
    devtool: "nosources-source-map",
    entry: {
        js: './client/client.js',
    },
    output: {
        path: path.join(__dirname, 'server', 'public', 'js'),
        filename: 'bundle.js',
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
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
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