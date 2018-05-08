//modules import
const   path = require('path'),
        webpack = require('webpack'),
        UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
        HtmlWebpackPlugin = require('html-webpack-plugin'),
        OptimizeJSPlugin = require('optimize-js-plugin');
//enviroment variable
let env = process.env.NODE_ENV || 'development';

//plugins configuration
const plugins = [
        new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body'
    })];
    //te wtyczki odpalają się zawsze
    if (env === 'production') {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin(),
            new OptimizeJSPlugin({
                sourceMap: false
            })
        )
    }
//te powyższe odpalają się tylko przy production.


//webpack.config.js
module.exports =  {
        entry: (env !== 'production' ? [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
        ] : []).concat(['./client/index.js']),
        output: {
            filename: './bundle.js',
            path: path.resolve(__dirname, 'public'),
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader'},
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins
};