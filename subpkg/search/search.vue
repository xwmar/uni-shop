<template>
	<view>
		<view class="search-box">
		  <!-- 使用 uni-ui 提搜索组件 -->
		    <uni-search-bar @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
		</view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '', // 搜索内容
        timer: null,
        searchResults: [], // 搜索结果列表
        historyList: ['a', 'app', 'apple'], // 历史搜索记录
			}
		},
    onLoad() {
      // 加载本地存储中的历史搜索记录
      this.historyList = JSON.parse(uni.getStorageSync('search') || '[]')
    },
		methods: {
			  input(e) {
			    // e 是最新的搜索内容
          clearTimeout(this.timer) // 清除定时器
          // 防抖处理
          this.timer = setTimeout(() => {
            this.value = e
            this.getSearchList()
          }, 500)
			  },
        // 获取商品搜索建议列表
        async getSearchList() {
          // 先判断是否为空
          if(this.value === '') return this.searchResults = []
          // 发起请求，获取搜索建议列表
          const { data } = await uni.$http.get('/goods/qsearch', { query: this.value })
          if(data.meta.status !== 200) return uni.$showMsg()
          this.searchResults = data.message
          // 调用保存历史记录方法
          this.saveSearchHistory()
        },
        // 保存搜索记录
        saveSearchHistory() {
          // 关键词去重
          // 1. 将数组转化为set对象
          let set = new Set(this.historyList)
          // 2. 删除对应的重复元素
          set.delete(this.value)
          // 3.将 Set 对象 转化为数组
          this.historyList =  Array.from(set)
          // 4. 合并元素
         this.historyList = [this.value, ...this.historyList]
         // 历史记录本地持久化存储
         uni.setStorageSync('search', JSON.stringify(this.historyList))
        },
        // 清空历史搜索记录
        cleanHistory() {
          // 清空 data 中的数据
          this.historyList = []
          // 清空本地存储记录
          uni.setStorageSync('search', '[]')
        },
        // 搜索转跳到商品详情页
        gotoDetail(id) {
          uni.navigateTo({
            url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
          })
        },
        // 点击跳转到商品列表页面
        gotoGoodsList(item) {
          uni.navigateTo({
            url: '/subpkg/goods_list/goods_list?query=' + item
          })
        }
 		}
	}
</script>

<style lang="scss">
.search-box {
  background-color: #c00000; 
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;
    
  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
      
    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin: 0 20rpx;
    }
  }
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    margin-left: 15rpx;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      color: #808080;
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
