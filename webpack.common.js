const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: "file-loader?name=src/assets/[name].[ext]"
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new CopyPlugin({
          patterns: [
            {
              from: './src/assets',
              to: 'assets',
            },
            {
              from: './src/css',
              to: 'css',
            },
            {
              from: './src/js',
              to: 'js',
            },
            {
              from: './src/pages',
              to: 'pages',
            },
            {
              from: './src/manifest.json',
              to: 'manifest.json',
            },
            {
              from: './src/sw.js',
              to: 'sw.js',
            }
          ]
        }),
    ]
}