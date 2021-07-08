<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view 
        v-for="(item, ind) in cateList"
        :key="item.cat_id"
        @click="cutActive(ind)"
        :class="['left-scroll-view-item',ind === active ? 'active' : '' ]"
        >{{item.cat_name}}</view>
        
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :scroll-top="scrollTop" :style="{height: wh + 'px'}">
        <!-- 右侧二级分类 -->
        <view class="left-scroll-view-item" v-for="item in cataTwoList" :key="item.cat_id">
          <view class="cate-lv2-title">/ {{item.cat_name}} /</view>
          <!-- 右侧三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="i in item.children" :key:="i.cat_id" @click="goodsListPage(i.cat_id)">
              <!-- 图片 -->
              <image :src="i.cat_icon"></image>
              <!-- 文本 -->
              <text>{{i.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
		      return {
		        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
		        wh: 0,
            cateList: [], // 左侧一级分类列表
            cataTwoList: [], // 左侧二级分类列表
            active: 0, // 样式默认索引
            scrollTop: 0 // 滚动条距离顶部的距离
		      };
		    },
		    onLoad() {
		      // 获取当前系统的信息
          // uni.getSystemInfoSync() 获取系统信息同步
		      const sysInfo = uni.getSystemInfoSync()
		      // windowHeight: 可使用窗口高度
		      this.wh = sysInfo.windowHeight
          
          this.getCateList()
		    },
        methods: {
          // 获取分类左侧数据列表
          async getCateList() {
            const { data } = await uni.$http.get('/categories')
            if(data.meta.status !== 200) return uni.$showMsg()
            // 一级分类数据
            this.cateList = data.message
            // 设置默认二级分类数据
            this.cataTwoList = this.cateList[0].children
          },
          // 左侧导航切换
          cutActive(index) {
            // 样式切换
            this.active = index
            // 二级分类数据切换
            this.cataTwoList = this.cateList[index].children
            // 重置滚动条距离顶部的距离q,值为0 ~ 1之间
            this.scrollTop = this.scrollTop === 0 ? 1 : 0
          },
          // 转跳到商品列表页
          goodsListPage(id){
            uni.navigateTo({
              url: '/subpkg/goods_list/goods_list?cid=' + id
            })
          }
        }
	}
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;
      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;
        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  
  // 右侧二级列表
  .right-scroll-view {
    .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
    }
    
    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;
      .cate-lv3-item {
        width: 33.33%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        image {
          width: 60px;
          height: 60px;
        }
        text {
          font-size: 12px;
        }
      }
    }
  }
  
}
</style>
