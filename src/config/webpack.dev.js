const path = require('path')
    //引入插件，自动生成html并引入js文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
    //css文件合并插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    //压缩css文件,在优化(optimization)里做配置，并且将mode设置为‘production’
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

//压缩js文件
const terserPlugin = require('terser-webpack-plugin')
    //传入env判断环境
module.exports = (env) => {
    return {
        entry: '../main.js',
        //多入口打包，造成重复打包
        // entry: {
        //     index: './src/index.js',
        //     another: './src/another.module.js'
        // },
        //抽离重复代码,方法一
        // entry: {
        //     index: {
        //         import: './src/index.js',
        //         dependOn: 'shared'
        //     },
        //     another: {
        //         import: './src/another.module.js',
        //         dependOn: 'shared'
        //     },

        //     shared: 'lodash' //shared是名称
        // },
        //抽离重复代码,方法二，配置内置插件split-chunks-Plugin
        // entry: {
        //     index: './src/index.js',
        //     another: './src/another.module.js'
        // },
        output: {
            // filename: 'app.js',
            // filename: '[name].bundle.js', //多出口
            filename: 'scripts/[name].[contenthash].js', //有利于浏览器缓存更新
            path: path.resolve(__dirname, './dist'), //使用绝对路径,_dirname指当前的webpack路径S
            clean: true, //清理dist
            assetModuleFilename: 'images/[hash][ext][query]', //设置资源生成路径及名称规则
            publicPath: 'http://localhost:8080/' //配置公共根路径
        },

        mode: env.production ? 'production' : 'development', //模式,development,production

        devtool: 'inline-source-map', //增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。

        devServer: { //实现热加载，不用手动刷新浏览器 npx webpack-dev-server --open
            static: './dist' //配置根目录位置
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html', //模版文件
                filename: 'app.html', //生成文件名
                inject: 'body' //script标签位置
            }),
            new MiniCssExtractPlugin({
                filename: 'styles/[contenthash].css'
            }),
            new terserPlugin()
        ],

        module: {
            rules: [{
                    test: /\.png/, //正则表达式
                    type: 'asset/resource', //资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。
                    // asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。图片
                    // asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。svg
                    // asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。txt
                    // asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现.
                    generator: {
                        filename: 'images/[hash][ext][query]'
                    },
                    // parser: { //解析器
                    //     dataUrlCondition: {
                    //         maxSize: 4 * 1024 * 1024 //大于此值才生成资源文件，否则是一个base64文件
                    //     }
                    // }
                },
                {
                    test: /\.(css|less)$/,
                    // use: ['style-loader', 'css-loader', 'less-loader']
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, //排除node_modules里面的js文件
                    use: {
                        loader: 'babel-loader', //在webpack里应用babel解析ES6的桥梁
                        options: {
                            presets: ['@babel/preset-env'], //babel预设，一组babel插件的集合
                            plugins: [
                                ['@babel/plugin-transform-runtime'] //运行async/await需要的插件
                            ]
                        }
                    }
                }
            ]
        },
        optimization: { //优化
            minimizer: [
                new CssMinimizerPlugin(),
            ],
            splitChunks: {
                // chunks: 'all' //分离代码
                //打包第三方库
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all'
                    }
                }
            },
        }
    }
}