<template>
  <view v-if="goodsDetail.goods_name">
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
      <swiper-item v-for="(item, i) in goodsDetail.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goodsDetail.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goodsDetail.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 商品详情信息 -->
    <rich-text :nodes="goodsDetail.goods_introduce"></rich-text>
    <view style="margin-top: 50rpx;"></view>
    <!-- 商品导航组件 -->
    <view class="goods-nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        goodsDetail: {}, // 商品详情对象
        // 左侧按钮组的配置对象
        options: [{
            icon: 'shop',
            text: '店铺'
          },
          {
            icon: 'headphones',
            text: '客服'
          }, {
            icon: 'cart',
            text: '购物车',
            info: 0
          }
        ],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      this.getGoodsDetail(options.goods_id)
      // console.log(this.total) // 购物车数量
    },
    watch: {
      // 监听 total(数量) 值的变化
      total: {
        handler(newVal, oldVal) {
          // 方式1: 直接指定修改 
          // this.options[2].info = newVal
          
          // 方式2: 通过数组的 find() 方法，找到购物车按钮的配置对象
          const findResult = this.options.find((item) => item.text === '购物车')
          if (findResult) {
            findResult.info = newVal // 动态为购物车按钮的 info 属性赋值
          }
        },
        immediate: true, //页面初始化完成后立即执行一次
      }
    },
    computed: {
      ...mapGetters('m_cart', ['total']),
    },
    methods: {
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart']),
      //获取商品详情
      async getGoodsDetail(goods_id) {
        const {
          data
        } = await uni.$http.get('/goods/detail', {
          goods_id
        })
        if (data.meta.status !== 200) return uni.$showMsg()
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
        data.message.goods_introduce = data.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
        // 为 data 中的数据赋值
        this.goodsDetail = data.message
      },
      // 实现轮播图的预览效果
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          current: i, // 预览时，默认显示图片的索引
          urls: this.goodsDetail.pics.map(item => item.pics_big) // 所有图片 url 地址的数组
        })
      },
      // 左侧按钮的点击事件处理函数
      onClick(e) {
        // console.log(e)
        if (e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        console.log(e)
        if (e.content.text === '加入购物车') {
          // 创建一个商品信息对象
          const goods = {
            goods_id: this.goodsDetail.goods_id, // 商品的Id
            goods_name: this.goodsDetail.goods_name, // 商品的名称
            goods_price: this.goodsDetail.goods_price, // 商品的价格
            goods_count: 1, // 商品的数量
            goods_small_logo: this.goodsDetail.goods_small_logo, // 商品的图片
            goods_state: true // 商品的勾选状态
          }
          // 调用映射过来的 addToCart(加入购物车) 方法
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 550rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域的样式
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0; // 上下10，左右0
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      // 收藏区域
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    // 运费
    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }

  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }

  .goods-nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
