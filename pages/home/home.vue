<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @searchClick="search"></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
          <image :src="item.image_src" mode=""></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)" >
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view> 
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image class="floor-title" :src="item.floor_title.image_src"></image>
        <!-- 楼层图片区域 -->
        <view class="floot-img-box">
          <!-- 楼层左侧图片 -->
          <navigator class="floot-left" :url="item.product_list[0].url">
            <image 
             :src="item.product_list[0].image_src" 
             :style="{width: item.product_list[0].image_width + 'rpx'}"
             mode="widthFix"
            ></image>
          <!-- 楼层右侧图片 -->
          </navigator>
          <view class="floot-right">
            <navigator  
            v-for="(i, ind) in item.product_list" 
            :key='ind'
            v-if="ind !== 0" 
            :url="i.url"
            >
            <image 
            :style="{width: i.image_width + 'rpx'}"
            :src="i.image_src" 
            mode="widthFix"
            ></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
   import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        swiperList: [], // 轮播图列表
        navList: [], // 分类导航
        floorList: [], // 楼层数据列表
      };
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 获取轮播图列表
      async getSwiperList() {
        const { data } = await uni.$http.get('/home/swiperdata')
        // console.log(data)
        if (data.meta.status !== 200) return uni.$showMsg()
        this.swiperList = data.message
      },
      // 获取分类导航数据
      async getNavList() {
        const { data } = await uni.$http.get('/home/catitems')
        // console.log(data)
        if (data.meta.status !== 200) return uni.$showMsg()
        this.navList = data.message
      },
      // 切换到分类导航
      navClickHandler(item) {
       if (item.name === '分类'){
         // 编程时导航转跳
         uni.switchTab({
           url: '/pages/cate/cate'
         })
       }
      },
      // 获取楼层数据列表
      async getFloorList() {
        const { data } = await uni.$http.get('/home/floordata')
        if(data.meta.status !== 200) return uni.$showMsg()
        // 处理 URL 地址
        data.message.forEach(item => {
          item.product_list.forEach(i => {
            let url = i.navigator_url.split('?')
            i.url = '/subpkg/goods_list/goods_list?' + url[1]
          })
        })
        this.floorList = data.message
      },
      // 搜索功能
      search() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 设置定位效果为“吸顶”
    background-color: #c00000;
    position: sticky;
    // 吸顶的“位置”
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
  // 轮播图样式
  swiper {
    height: 330rpx;
    
    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }
  // 分类导航样式
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;
  
    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }
  // 楼层标题样式
  .floor-title {
    height: 60rpx;
    width: 100%;
  }
  // 楼层图片样式
  .floot-img-box {
    display: flex;
    margin-left: 10rpx;
    
    .floot-right  {
     display: flex;
     justify-content: space-around;
     flex-wrap: wrap;
    }
  }
  
  
</style>
