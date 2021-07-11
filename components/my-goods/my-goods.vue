<template>
  <view>
    <view class="goods-item">
      <!-- 商品左侧图片区域 -->
      <view class="goods-item-left">
        <!-- 存储在购物车中的商品，包含 goods_state 属性，表示商品的勾选状态 -->
        <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio === true" @click="radioClickHandler" />
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 商品右侧信息区域 -->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" v-if="showNum" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      goods: { // 商品信息对象
        type: Object,
        default: {}
      },
      showRadio: { // 外部不指定值,默认不显示
        type: Boolean,
        default: false
      },
      showNum : { // 是否展示价格右侧的 NumberBox 组件
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      }
    },
    methods: {
      // 处理选中状态的函数
      radioClickHandler() {
        this.$emit('radio-change', {
          // 商品的 Id
          goods_id: this.goods.goods_id,
          // 商品最新的勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      // 处理商品数量的函数
      numChangeHandler(val) {
        // console.log(val) // 商品数量
        this.$emit('num-change', {
          // 商品的 Id
          goods_id: this.goods.goods_id,
          // 商品的最新数量
          goods_count: + val
        })
      }
    },
    filters: {
      // 把数字处理为带两位小数点的数字
      toFixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: center;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        // display: block;
        vertical-align: middle;
        // https://segmentfault.com/q/1010000000694663
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }
      
      .goods-info-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
