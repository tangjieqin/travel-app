<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()  

const destination = ref('')
const budget = ref('')
const days = ref('')

const showCityPicker = ref(false)
const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆', '南京', '苏州', '厦门', '三亚', '丽江', '大理', '青岛']
const cityColumns = cities.map(name => ({ text: name, value: name }))

const onConfirmCity = ({ selectedValues }) => {
  destination.value = selectedValues[0] || ''
  showCityPicker.value = false
}

const hotCities = [
  { name: '北京' },
  { name: '上海' },
  { name: '广州' },
  { name: '深圳' },
  { name: '成都' },
  { name: '杭州' },
  { name: '西安' },
  { name: '重庆' }
]

const handleStartPlan = () => {
  if (!destination.value) {
    showToast('请选择目的地')
    return
  }
  if (!budget.value) {
    showToast('请输入预算金额')
    return
  }
  if (!days.value) {
    showToast('请输入天数')
    return
  }
  router.push({
    name: 'Detail',
    query: {
      destination: destination.value,
      budget: budget.value,
      days: days.value
    }
  })
}

const handleHotCityClick = (city) => {
  destination.value = city
}

const goToChat = () => {
  router.push('/chat')
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="home-container">
    <div class="page-title">
      <h1>智能旅游助手</h1>
    </div>

    <van-notice-bar
      class="notice-bar"
      left-icon="info-o"
      text="基于 AI 的智能景点介绍与行程规划系统"
      background="#fff7e6"
      color="#ad6800"
      :scrollable="false"
    />

    <van-cell-group inset class="plan-card">
      <div class="card-title">规划你的旅程</div>
      <van-field
        v-model="destination"
        is-link
        readonly
        label="目的地"
        placeholder="请选择城市"
        @click="showCityPicker = true"
      />
      <van-field
        v-model="budget"
        type="digit"
        label="预算（元）"
        placeholder="请输入预算金额"
        clearable
      />
      <van-field
        v-model="days"
        type="digit"
        label="天数"
        placeholder="请输入天数"
        clearable
      />
      <div class="btn-wrapper">
        <van-button
          type="primary"
          block
          round
          size="large"
          class="start-btn"
          @click="handleStartPlan"
        >
          开始规划
        </van-button>
      </div>
    </van-cell-group>

    <van-cell-group inset class="quick-card">
      <div class="card-title">快捷入口</div>
      <div class="quick-grid">
        <div class="quick-item" @click="goToChat">
          <van-icon name="chat-o" size="30" color="#323233" />
          <span class="quick-label">AI对话</span>
        </div>
        <div class="quick-item" @click="goToProfile">
          <van-icon name="user-o" size="30" color="#323233" />
          <span class="quick-label">我的</span>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group inset class="hot-card">
      <div class="card-title">热门目的地</div>
      <div class="hot-grid">
        <div
          v-for="item in hotCities"
          :key="item.name"
          class="hot-item"
          :class="{ 'hot-item-active': destination === item.name }"
          @click="handleHotCityClick(item.name)"
        >
          {{ item.name }}
        </div>
      </div>
    </van-cell-group>

    <van-popup
      v-model:show="showCityPicker"
      round
      position="bottom"
      safe-area-inset-bottom
      class="city-picker-popup"
    >
      <van-picker
        :columns="cityColumns"
        toolbar-title="选择城市"
        @confirm="onConfirmCity"
        @cancel="showCityPicker = false"
      />
    </van-popup>
  </div>
</template>

<style scoped>
.home-container {
  padding: 16px 0 20px;
  background-color: #f2f4f7;
  box-sizing: border-box;
}
.page-title {
  text-align: center;
  padding: 8px 16px 14px;
}
.page-title h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1f1f21;
  letter-spacing: 0.5px;
}
.notice-bar {
  margin: 0 16px 14px;
  border-radius: 10px;
  min-height: 40px;
  font-size: 14px;
}
.plan-card,
.quick-card,
.hot-card {
  margin-bottom: 14px;
  border-radius: 14px !important;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.card-title {
  padding: 16px 18px 12px;
  font-size: 17px;
  font-weight: 700;
  color: #1f1f21;
  letter-spacing: 0.3px;
}
.plan-card :deep(.van-cell-group__title),
.plan-card :deep(.van-cell-group__footer) {
  display: none;
}
.plan-card :deep(.van-cell) {
  margin: 0 16px 12px;
  padding: 14px 16px;
  background-color: #f5f6f8;
  border-radius: 10px;
  font-size: 16px;
  line-height: 1.4;
}
.plan-card :deep(.van-cell:first-of-type) {
  margin-top: 0;
}
.plan-card :deep(.van-cell::after) {
  display: none;
}
.plan-card :deep(.van-cell__label) {
  font-size: 16px;
  color: #1f1f21;
  font-weight: 500;
  flex-basis: 90px;
  flex-shrink: 0;
}
.plan-card :deep(.van-field__control) {
  font-size: 16px;
  color: #646566;
}
.plan-card :deep(.van-field__control--placeholder) {
  color: #969799;
}
.btn-wrapper {
  padding: 10px 16px 18px;
}
.start-btn {
  height: 50px;
  font-size: 17px;
  font-weight: 600;
  border-radius: 999px !important;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.22);
}
.quick-grid {
  display: flex;
  padding: 0 16px 18px;
  gap: 14px;
}
.quick-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px 0;
  background-color: #ffffff;
  border: 1px solid #f0f1f3;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.quick-item:active {
  background-color: #f5f6f8;
  transform: scale(0.98);
}
.quick-label {
  margin-top: 10px;
  font-size: 15px;
  color: #323233;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.hot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0 16px 18px;
}
.hot-item {
  padding: 14px 0;
  text-align: center;
  font-size: 15px;
  color: #323233;
  background-color: #f7f8fa;
  border: 1px solid #eef0f3;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.hot-item:active {
  background-color: #eceef1;
}
.hot-item-active {
  background-color: #e8f3ff;
  border-color: #c9dffc;
  color: #1989fa;
  font-weight: 600;
}
</style>
