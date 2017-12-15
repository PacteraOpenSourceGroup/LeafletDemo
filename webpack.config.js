const path = require('path');
module.exports = {
    //打包的入口文件  可配置多入口
    entry: [path.resolve(__dirname, 'src/index.js'), 'whatwg-fetch'],
    output: { //配置打包结果     Object
        //定义输出文件路径
        path: path.resolve(__dirname, 'build'),
        //指定打包文件名称
        filename: 'bundle.js',
        // 输出解析文件的目录，url 相对于 HTML 页面
        pathinfo: true, // 在生成代码时，引入相关的模块、导出、请求等有帮助的路径信息。
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }, resolve: {  //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['.css', '.js', '.json', '.scss', '.jsonp']
    }, devServer: {
        port: 3333,
        hot: true
    }
};