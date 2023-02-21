// module.exports = {
//     devServer: {
//         proxy: {
//             '/charity': {
//                 // 此处的写法，目的是为了 将 /api 替换成 http://localhost:8081/charity/
//                 target: 'http://localhost:8081/charity/',
//                 // 允许跨域
//                 changeOrigin: true,
//                 ws: true,
//                 pathRewrite: {
//                     '^/charity': ''
//                 }
//             }
//         }
//     }
// }