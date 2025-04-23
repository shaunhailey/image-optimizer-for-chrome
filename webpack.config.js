const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        popup: './src/popup/popup.ts',
        background: './src/background/background.ts',
        tab: './src/tab/tab.ts'
    },
    output: {
        filename: '[name]/[name].js',  // Put files in their own folders
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'popup/popup.html',  // Put HTML in the popup folder
            template: './src/popup/popup.html',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            filename: 'tab/tab.html',
            template: './src/tab/tab.html',
            chunks: ['tab']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/manifest.json', to: 'manifest.json' },
                { from: './src/icons', to: 'icons', noErrorOnMissing: true },
                { from: './src/assets', to: 'assets', noErrorOnMissing: true }
            ],
        })
    ],
    devtool: 'source-map',
    devServer: {
        static: './dist',
        hot: true
    }
};