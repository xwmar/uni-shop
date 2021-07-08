import{ $http } from '@escook/request-miniprogram'

uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
// 请求开始之前
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '拼命加载中...',
  })
}
// 请求完成之后
$http.afterRequest = function () {
  uni.hideLoading()
}