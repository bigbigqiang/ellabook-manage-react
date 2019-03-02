/**
 * 开发环境配置的打包文件
 */
var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: "eval-source-map",
    entry : {
        main : path.resolve(__dirname,'./src/main.js'),
    },
    output:{
        path: path.resolve(__dirname,'./dist'),
        filename: 'build.js',
        publicPath: 'dist/',
        chunkFilename: '[name].[chunkhash:5].chunk.js'
    },
    module: {
        rules: [
            {test: /\.less/, use: ['style-loader','css-loader','less-loader']},
            { test: /\.css$/, use: ['style-loader','css-loader'] },
            { test: /\.(png|jpg|jpeg|gif)$/, use: ['url-loader']},
            { test: /\.(eot|svg|ttf|woff|woff2)\w*/, use: ['url-loader']},
            {test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-0','react'],
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.json', '.scss','.less','jsonp'],
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer:{
        inline:true,
        hot: true,
        port:8080,
        host: '0.0.0.0'
    }
};
