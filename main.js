import Vue from 'vue'
import App from './App'
// 引入网络配置请求
import './common/request.js'

// 封装展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败!', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
