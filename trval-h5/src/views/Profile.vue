<script setup>

const onLogout = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？'
    })
    showToast('已退出登录')
  } catch {
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="user-info">
        <van-image
          round
          width="64"
          height="64"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="user-detail">
          <div class="user-name">用户昵称</div>
          <div class="user-id">ID: 10086</div>
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-num">128</div>
        <div class="stat-label">收藏</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">356</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">892</div>
        <div class="stat-label">粉丝</div>
      </div>
    </div>

    <van-cell-group inset style="margin-top: 16px;">
      <van-cell title="我的订单" is-link icon="orders-o" size="large" />
      <van-cell title="我的收藏" is-link icon="star-o" size="large" />
      <van-cell title="历史记录" is-link icon="clock-o" size="large" />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 16px;">
      <van-cell title="设置" is-link icon="setting-o" size="large" />
      <van-cell title="帮助与反馈" is-link icon="info-o" size="large" />
      <van-cell title="关于我们" is-link icon="description" size="large" />
    </van-cell-group>

    <div style="padding: 16px;">
      <van-button block type="danger" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  background: linear-gradient(135deg, #1989fa 0%, #5ab1ff 100%);
  padding: 32px 16px 24px;
  color: #fff;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-detail {
  flex: 1;
}
.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}
.user-id {
  font-size: 13px;
  opacity: 0.8;
}
.profile-stats {
  display: flex;
  background-color: #fff;
  padding: 16px 0;
  border-bottom: 1px solid #ebedf0;
}
.stat-item {
  flex: 1;
  text-align: center;
}
.stat-num {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}
.stat-label {
  font-size: 13px;
  color: #646566;
}
</style>
