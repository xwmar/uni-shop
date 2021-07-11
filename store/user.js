export default {
  namespaced: true,

  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}') // 收货地址
  }),
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 调用数据持久化方法
      this.commit('m_user/saveAddressToStorage')
    },
    // address 持久化存储到本地
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
      if(!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
