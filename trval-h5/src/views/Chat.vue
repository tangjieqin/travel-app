<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { streamChat } from '../api/chat'

const router = useRouter()

const question = ref('')
const quickQuestions = [
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
]

const messages = ref([])
const listRef = ref(null)
const activeRunId = ref(0)
const abortController = ref(null)

const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const scrollToBottom = () => {
  nextTick(() => {
    const el = listRef.value
    if (!el) return
    el.scrollTop = el.scrollHeight
  })
}

const pickQuestion = (q) => {
  question.value = q
  sendMessage()
}

const sendMessage = () => {
  const text = question.value.trim()
  if (!text) {
    showToast('请输入您的问题')
    return
  }

  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }

  const runId = ++activeRunId.value
  question.value = ''

  messages.value.push({
    id: genId(),
    role: 'user',
    content: text
  })

  const assistantId = genId()
  messages.value.push({
    id: assistantId,
    role: 'assistant',
    content: '',
    streaming: true,
    runId
  })
  scrollToBottom()

  const history = messages.value
    .filter((m) => m.id !== assistantId)
    .map((m) => ({ role: m.role, content: m.content }))
    .slice(-20)

  const ctrl = new AbortController()
  abortController.value = ctrl

  streamChat({
    message: text,
    history,
    runId,
    signal: ctrl.signal,
    onChunk: (chunk, chunkRunId) => {
      if (chunkRunId !== activeRunId.value) return
      const msg = messages.value.find((m) => m.id === assistantId)
      if (!msg) return
      msg.content += chunk
      scrollToBottom()
    },
    onDone: (doneRunId) => {
      if (doneRunId !== activeRunId.value) return
      const msg = messages.value.find((m) => m.id === assistantId)
      if (!msg) return
      msg.streaming = false
      if (abortController.value === ctrl) abortController.value = null
      scrollToBottom()
    },
    onError: (err, errRunId) => {
      if (errRunId !== activeRunId.value) return
      const msg = messages.value.find((m) => m.id === assistantId)
      if (!msg) return
      msg.streaming = false
      msg.content += `\n\n（出错了：${err.message || String(err)}）`
      if (abortController.value === ctrl) abortController.value = null
      scrollToBottom()
    }
  })
}

onBeforeUnmount(() => {
  if (abortController.value) abortController.value.abort()
})
</script>

<template>
  <div class="chat-container">
    <van-nav-bar
      class="chat-nav"
      title="AI 旅游助手"
      left-arrow
      left-text="返回"
      fixed
      placeholder
      safe-area-inset-top
      @click-left="router.push('/home')"
    />

    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-illustration" aria-hidden="true">
        <div class="empty-printer">
          <div class="printer-tray"></div>
          <div class="printer-paper">
            <span class="paper-line w-70"></span>
            <span class="paper-line"></span>
            <span class="paper-line"></span>
            <span class="paper-line w-50"></span>
          </div>
          <div class="printer-base"></div>
        </div>
      </div>
      <p class="empty-title">开始和 AI 助手对话吧！</p>
      <p class="empty-subtitle">常见问题</p>
      <div class="quick-list">
        <button
          v-for="(q, idx) in quickQuestions"
          :key="idx"
          type="button"
          class="quick-btn"
          @click="pickQuestion(q)"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <div v-else class="message-list" ref="listRef">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-item"
        :class="msg.role === 'user' ? 'is-user' : 'is-assistant'"
      >
        <div class="avatar" :class="msg.role">
          <span v-if="msg.role === 'user'">我</span>
          <span v-else>AI</span>
        </div>
        <div class="bubble" :class="msg.role">
          <span class="bubble-content">{{ msg.content }}</span>
          <span
            v-if="msg.role === 'assistant' && msg.streaming"
            class="streaming-cursor"
            aria-hidden="true"
          >|</span>
        </div>
      </div>
      <div class="list-bottom-padding" aria-hidden="true"></div>
    </div>

    <div class="bottom-input">
      <div class="input-wrap">
        <input
          v-model="question"
          class="chat-input"
          type="text"
          placeholder="输入您的问题..."
          @keydown.enter="sendMessage"
        />
        <button type="button" class="send-btn" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background: #f2f4f7;
  padding-bottom: 120px;
  box-sizing: border-box;
}
.chat-nav {
  background-color: #ffffff;
  border-bottom: 1px solid #ebedf0;
  width: 100%;
  max-width: 540px !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 auto !important;
}

/* ---------- 空态 ---------- */
.empty-state {
  padding: 70px 24px 50px;
  text-align: center;
}
.empty-illustration {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 34px;
}
.empty-printer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 108px;
  height: 94px;
}
.printer-base {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 16px;
  background: #e3e5e8;
  border-radius: 0 0 6px 6px;
}
.printer-tray {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 16px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #e3e5e8;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  box-shadow: inset 0 -3px 0 rgba(200, 203, 207, 0.5);
}
.printer-paper {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 72px;
  height: 60px;
  background: #ffffff;
  border: 1px solid #e3e5e8;
  border-bottom: none;
  padding: 9px 9px 7px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 -2px 0 rgba(200, 203, 207, 0.35);
}
.paper-line {
  display: block;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #dfe2e6;
}
.paper-line.w-70 { width: 70%; }
.paper-line.w-50 { width: 50%; }

.empty-title {
  margin: 0 0 28px;
  font-size: 17px;
  color: #6e7378;
  letter-spacing: 0.3px;
  font-weight: 500;
}
.empty-subtitle {
  margin: 0 0 18px;
  font-size: 15px;
  color: #80858b;
  font-weight: 500;
}
.quick-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 14px;
  max-width: 460px;
  margin: 0 auto;
}
.quick-btn {
  border: none;
  outline: none;
  background: #dfe2e6;
  color: #3a3d42;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 999px;
  line-height: 1.5;
  cursor: pointer;
  transition: background 0.15s ease;
}
.quick-btn:active {
  background: #cdd0d4;
}

/* ---------- 消息列表 ---------- */
.message-list {
  height: calc(100vh - 120px - 48px);
  height: calc(100dvh - 120px - 48px);
  overflow-y: auto;
  padding: 18px 14px 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  background: #f2f4f7;
}
.list-bottom-padding {
  height: 10px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 18px;
}
.message-item.is-user {
  flex-direction: row-reverse;
}
.avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.avatar.user {
  background: linear-gradient(135deg, #1989fa, #54a5ff);
}
.avatar.assistant {
  background: linear-gradient(135deg, #07c160, #54d089);
}

.bubble {
  max-width: 72%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 15px;
  line-height: 1.65;
  word-break: break-word;
  white-space: pre-wrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.bubble.user {
  background: #1989fa;
  color: #ffffff;
  border-top-right-radius: 4px;
}
.bubble.assistant {
  background: #ffffff;
  color: #1f1f21;
  border-top-left-radius: 4px;
}
.bubble-content {
  vertical-align: middle;
}

.streaming-cursor {
  display: inline-block;
  margin-left: 1px;
  width: 2px;
  height: 16px;
  background: #1f1f21;
  vertical-align: -2px;
  animation: blink 1s steps(2) infinite;
  margin-right: 1px;
}
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* ---------- 底部输入 ---------- */
.bottom-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 540px;
  padding: 10px 12px calc(10px + 50px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #ebedf0;
  box-sizing: border-box;
  z-index: 10;
}
.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 14px;
  background: #f2f4f7;
  border: none;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  color: #1f1f21;
  box-sizing: border-box;
}
.chat-input::placeholder {
  color: #a8abaf;
}
.send-btn {
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border: none;
  outline: none;
  border-radius: 20px;
  background: #1989fa;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.send-btn:active {
  background: #1577d9;
}
</style>
