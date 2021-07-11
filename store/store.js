// 1.导入 vue 和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 导入cart模块
import moduleCart from './cart.js'
import moduleUser from './user.js'

// 2. 将vuex安装为vue的插件
Vue.use(Vuex)
// 3. 创建Store 的实例对象
const store = new Vuex.Store({
  // TODO：挂载 store 模块
  modules:{
    'm_cart': moduleCart, // 购物车模块
    'm_user': moduleUser, // 用户模块
  },
})

// 向外暴露 store 的实例对象
export default store