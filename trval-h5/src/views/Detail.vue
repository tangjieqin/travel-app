<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTravelRecommend } from '../api/travel'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const result = ref(null)
const isMock = ref(false)
const activeDay = ref(1)

const destinationParam = computed(() => String(route.query.destination || ''))
const budgetParam = computed(() => String(route.query.budget || ''))
const daysParam = computed(() => String(route.query.days || ''))

const navTitle = computed(() => {
  return destinationParam.value ? `${destinationParam.value}行程规划` : '行程规划'
})

const budgetRows = computed(() => {
  const b = result.value?.budgetBreakdown || {}
  return [
    { name: '住宿',   value: Number(b.hotel)   || 0 },
    { name: '餐饮',   value: Number(b.food)    || 0 },
    { name: '交通',   value: Number(b.transport) || 0 },
    { name: '门票',   value: Number(b.tickets) || 0 },
    { name: '其他',   value: Number(b.other)   || 0 },
  ]
})

const grandTotal = computed(() => {
  return budgetRows.value.reduce((sum, r) => sum + r.value, 0)
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const resp = await getTravelRecommend({
      destination: destinationParam.value,
      budget: budgetParam.value,
      days: daysParam.value
    })
    if (resp && resp.ok) {
      result.value = resp.data
      isMock.value = !!resp.mock
      activeDay.value = 1
    } else {
      error.value = '获取行程信息失败，请稍后重试'
    }
  } catch (e) {
    error.value = '获取行程信息失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const segments = (day) => [day.morning, day.afternoon, day.evening].filter(Boolean)

onMounted(loadData)
</script>

<template>
  <div class="detail-container">
    <van-nav-bar
      class="detail-nav"
      :title="navTitle"
      left-arrow
      left-text="返回"
      fixed
      placeholder
      safe-area-inset-top
      @click-left="router.back()"
    />

    <div v-if="loading" class="loading-wrap">
      <van-loading vertical size="22px" color="#969799">正在生成旅游规划...</van-loading>
    </div>

    <div v-else-if="error" class="error-wrap">
      <div class="error-text">{{ error }}</div>
      <van-button type="primary" block size="small" style="width: 160px; margin: 18px auto 0" @click="loadData">重新加载</van-button>
    </div>

    <template v-else-if="result">
      <div class="overview-card">
        <div class="overview-left">
          <div class="mock-tag" v-if="isMock">示例数据</div>
          <h1 class="overview-title">
            {{ result.destination }} · {{ result.days }}天行程
          </h1>
        </div>
        <div class="overview-right">
          <span class="budget-label">预算：</span>
          <span class="budget-value">{{ result.budget }}元</span>
        </div>
      </div>

      <van-collapse
        v-model="activeDay"
        accordion
        class="day-collapse"
      >
        <van-collapse-item
          v-for="day in result.itinerary"
          :key="day.day"
          :name="day.day"
          :title="`第${day.day}天`"
        >
          <div class="segment-list">
            <div
              v-for="(seg, sIdx) in segments(day)"
              :key="sIdx"
              class="segment-card"
            >
              <div class="period-tag" :class="`period-${seg.period}`">
                {{ seg.period }}
              </div>
              <h3 class="seg-title">{{ seg.title.replace(/^[^·]+·/, '') }}</h3>
              <div class="meta-list">
                <div class="meta-item">
                  <span class="meta-dot">⏱</span>
                  <span class="meta-text">{{ seg.duration }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-dot">🎫</span>
                  <span class="meta-text">{{ seg.ticket }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-dot">🚇</span>
                  <span class="meta-text">{{ seg.transport }}</span>
                </div>
              </div>
              <p class="seg-desc">{{ seg.desc }}</p>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <div class="section-card budget-card" v-if="result.budgetBreakdown">
        <h2 class="card-title">预算明细</h2>
        <div class="budget-list">
          <div
            class="budget-row"
            v-for="(row, idx) in budgetRows"
            :key="idx"
          >
            <span class="budget-name">{{ row.name }}</span>
            <span class="budget-money">¥{{ row.value }}</span>
          </div>
          <div class="budget-row total-row">
            <span class="budget-name">总计</span>
            <span class="budget-money budget-total">¥{{ grandTotal }}</span>
          </div>
        </div>
      </div>

      <div class="section-card tips-card" v-if="result.tips && result.tips.length">
        <h2 class="card-title">温馨提示</h2>
        <div class="tips-paragraphs">
          <p v-for="(t, idx) in result.tips" :key="idx" class="tips-p">
            {{ t }}
          </p>
        </div>
      </div>

      <div class="section-card notices-card" v-if="result.notices && result.notices.length">
        <h2 class="card-title">注意事项</h2>
        <div class="notices-paragraphs">
          <p v-for="(n, idx) in result.notices" :key="idx" class="notices-p">
            {{ n }}
          </p>
        </div>
      </div>

      <div class="bottom-actions">
        <van-button
          type="primary"
          block
          class="ask-btn"
          size="normal"
          @click="router.push('/chat')"
        >
          咨询 AI 助手
        </van-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-container {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #f0f3f5;
  padding-bottom: 96px;
  box-sizing: border-box;
}
.detail-nav {
  background-color: #ffffff;
  border-bottom: 1px solid #ebedf0;
  width: 100%;
  max-width: 540px !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 auto !important;
}
.loading-wrap,
.error-wrap {
  margin-top: 28%;
  text-align: center;
  color: #969799;
  font-size: 15px;
}
.error-text {
  font-size: 15px;
  color: #ee0a24;
}
.overview-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 12px 10px;
  padding: 18px 16px;
  background: #ffffff;
  border-radius: 10px;
}
.overview-left {
  flex: 1;
  min-width: 0;
}
.mock-tag {
  display: inline-block;
  padding: 3px 8px;
  margin-bottom: 8px;
  font-size: 11px;
  line-height: 1;
  color: #ad6800;
  background: #fff7e6;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.overview-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1f1f21;
  line-height: 1.3;
  letter-spacing: 0.5px;
}
.overview-right {
  flex-shrink: 0;
  text-align: right;
  padding-top: 4px;
  line-height: 1.4;
}
.budget-label {
  font-size: 13px;
  color: #969799;
}
.budget-value {
  font-size: 17px;
  font-weight: 700;
  color: #b82938;
}
.day-collapse {
  margin: 0 12px;
  border-radius: 10px;
  overflow: hidden;
}
:deep(.van-collapse-item__title) {
  padding: 16px 16px;
  font-size: 17px;
  font-weight: 600;
  color: #1f1f21;
}
:deep(.van-collapse-item__content) {
  padding: 0 12px 16px;
  background: #ffffff;
}
.segment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.segment-card {
  padding: 14px 14px 12px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #eef0f2;
}
.period-tag {
  display: inline-block;
  padding: 4px 10px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.period-上午 {
  color: #c47a00;
  background: #fff3dc;
}
.period-下午 {
  color: #1d6fda;
  background: #e2edff;
}
.period-晚上 {
  color: #5e47a8;
  background: #eee8fb;
}
.seg-title {
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #1f1f21;
  line-height: 1.4;
}
.meta-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 10px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #eceef1;
  margin-bottom: 10px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #323233;
  line-height: 1.5;
}
.meta-dot {
  flex-shrink: 0;
  font-size: 13px;
}
.meta-text {
  flex: 1;
}
.seg-desc {
  margin: 0;
  font-size: 13px;
  color: #646566;
  line-height: 1.75;
  text-align: justify;
}
.section-card {
  margin: 10px 12px;
  padding: 18px 16px 16px;
  background: #ffffff;
  border-radius: 10px;
}
.card-title {
  margin: 0 0 14px;
  font-size: 17px;
  font-weight: 700;
  color: #1f1f21;
  letter-spacing: 0.5px;
}
.budget-list {
  display: flex;
  flex-direction: column;
}
.budget-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 2px;
  font-size: 15px;
  line-height: 1.4;
  border-bottom: 1px solid #f2f4f7;
}
.budget-row:last-child {
  border-bottom: none;
}
.budget-name {
  color: #323233;
  font-weight: 500;
}
.budget-money {
  color: #323233;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.budget-row.total-row {
  margin-top: 6px;
  padding: 12px 14px;
  background: #f2f4f7;
  border-radius: 6px;
  border-bottom: none;
}
.budget-row.total-row .budget-name {
  font-weight: 600;
  color: #323233;
}
.budget-total {
  font-size: 19px;
  font-weight: 700;
  color: #b82938;
}
.tips-paragraphs,
.notices-paragraphs {
  display: flex;
  flex-direction: column;
}
.tips-p,
.notices-p {
  margin: 0;
  padding: 8px 0;
  font-size: 14px;
  color: #323233;
  line-height: 1.75;
  text-align: justify;
  border-bottom: 1px dashed #eceff2;
}
.tips-p:last-child,
.notices-p:last-child {
  border-bottom: none;
}
.notices-p {
  color: #646566;
}
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 540px;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
  padding-bottom: calc(8px + 50px + env(safe-area-inset-bottom));
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff 30%);
  box-sizing: border-box;
  z-index: 10;
}
.ask-btn {
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 6px 14px rgba(25, 137, 250, 0.28);
}
</style>
