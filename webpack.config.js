const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PORT = process.env.PORT || 4000;
const srcPath = path.resolve(__dirname, 'src')
const distPath = path.resolve(__dirname, 'dist')

const configBase = {
    entry: [
        path.resolve(srcPath, 'index.ts'),
    ],
    output: {
        path: distPath,
        filename: "bundle.js",
        publicPath: '/dist/'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        alias: {
            '@': srcPath
        }
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: path.resolve(srcPath, 'index.html'), to: path.resolve(distPath) }
        ])
    ],

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loaders: [
                    "awesome-typescript-loader"
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, "src"),
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader?sourceMap",
                    "postcss-loader?sourceMap",
                    "sass-loader?sourceMap",
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: "file-loader"
            }
        ]
    },
};

const dev = {
    devServer: {
        inline: true,
        historyApiFallback: {
            index: 'src/index.html'
        },
        host: '0.0.0.0',
        hot: true,
        port: PORT,
        publicPath: '/dist/',
        disableHostCheck: true,
        stats: {
            chunks: false,
            colors: true
        },
    },
    plugins: [
        ...configBase.plugins,
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
}

const prod = {
    plugins: [
        ...configBase.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            },
            compressor: {
                warnings: false
            }
        }),
    ],
}

const env = process.env.NODE_ENV || 'dev';
module.exports = Object.assign(configBase, env == 'production' ? prod : dev);
