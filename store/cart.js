export default {
  namespaced: true,
  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'), // 购物车列表
  }),
  mutations: {
    // 加入购物车
    addToCart(state, goods) {
      // 查找是否存在相同商品
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(!findResult) {
        // 没有重复商品,添加到列表
        state.cart.unshift(goods)
        // console.log(state.cart)
      }else{
        // 存在相同商品, 数量加1
        findResult.goods_count++
      }
      // 调用数据持久化方法
      this.commit('m_cart/saveToStorage')
    },
    // 购物车数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 切换购物车选中状态
    updateGoodsState(state, goods) {
      // 查询有无对应商品信息
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(findResult) { // 有对应商品
        findResult.goods_state = goods.goods_state // 更新选中状态
        this.commit('m_cart/saveToStorage') // 数据持久化
      }
    },
    // 修改商品数量
    updateGoodsCount(state, goods) {
      // 查询有无对应商品信息
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(findResult) { // 有对应商品
          findResult.goods_count = goods.goods_count // 更新对应商品的数量
          this.commit('m_cart/saveToStorage') // 数据持久化
      }
    },
    // 删除购物车商品
    removeGoodsById(state, goods_id) {
      // 过滤出要删除的商品
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    // 全选反选
    updateAllGoodsState(state, newState) {
      state.cart.forEach(item => item.goods_state = newState)
      // 持久化存储
      this.commit('m_cart/saveToStorage')
    }
  },
  getters: {
    // 购物车总数
    total(state) {
      return state.cart.reduce((acc,cur) => acc + cur.goods_count, 0)
    },
    // 已选商品
    checkedCount(state) {
      return  state.cart.filter(i => i.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已选商品总价
    checkedGoodsAmount(state) {
      return state.cart.filter(item => item.goods_state).reduce((acc,cur) => acc + cur.goods_count * 100 * cur.goods_price / 100, 0).toFixed(2)
    }
  }
}