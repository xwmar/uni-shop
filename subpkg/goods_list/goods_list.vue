<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click='gotoDetail(goods)'>
       <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goodsList: [], // 商品列表的数据
        total: 0, // 总数,用来判断是否请求完毕
        isLoading: false, // 是否在请求数据
        queryObj: { // 请求参数对象
          query: '', // 查询关键词
          cid: '', // 商品分类Id
          pagenum: 1, // 页码值
          pagesize: 10 // 每页显示多少条数据
        }
      }
    },
    onLoad(options) {
      // 把页面参数保存到 this.queryObj 中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        this.isLoading = true // 开始请求
        // 发起请求
        const { data: res } = await uni.$http.get('/goods/search', this.queryObj)
        this.isLoading = false // 请求完毕
        // 数据请求完毕,立即按需调用cb回调函数
        cb && cb( uni.$showMsg('刷新成功!'))
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值
        this.goodsList = [ ...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 转跳到商品详情页
      gotoDetail(goods) {
        console.log(goods)
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    onReachBottom() {
      // 判断数据是否全部加载完
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('没有更多了!')
      // 判断是否正在执行其他请求
      if (this.isLoading) return
      // 页码+1
      this.queryObj.pagenum += 1
      // 重新获取列表数据
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 1.重置请求参数
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      // 2. 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
