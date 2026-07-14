<script setup>
</script>

<template>
  <div class="app-container">
    <RouterView />
    <van-tabbar
      class="app-tabbar"
      route
      active-color="#1989fa"
      fixed
      placeholder
      safe-area-inset-bottom
    >
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/chat" icon="chat-o">对话</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
}
.app-tabbar {
  width: 100%;
  max-width: 540px !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 auto !important;
}
</style>
