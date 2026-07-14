import { sseRequest } from '../utils/sse'

function buildMockReply(userMessage) {
  const msg = (userMessage || '').trim()
  const lower = msg.toLowerCase()

  if (/北京/.test(msg) || /必去|必玩|景点/.test(msg)) {
    return `关于${/北京/.test(msg) ? '北京' : '这个目的地'}的必去景点，我给你梳理一份高分清单👇

1. 天安门广场 & 故宫博物院（紫禁城）
   · 世界上最大的城市广场，明清两代皇家宫殿
   · 建议提前 7 天晚上 8 点在官网抢票，珍宝馆和钟表馆值得单独加
   · 预留 3-4 小时，沿中轴线从午门进、神武门出

2. 八达岭长城 / 慕田峪长城
   · "不到长城非好汉"，八达岭名气大但人多；慕田峪景色秀美，缆车体验更舒服
   · 建议上午出发，穿舒服的运动鞋，带足水和零食

3. 颐和园 + 圆明园
   · 颐和园是保存最完整的皇家行宫御苑，昆明湖泛舟非常惬意
   · 圆明园主要看西洋楼遗址，有历史厚重感，适合带小朋友做爱国教育

4. 天坛 / 南锣鼓巷 / 什刹海
   · 天坛是皇帝祭天的地方，祈年殿非常出片
   · 什刹海的胡同 + 后海的夜晚酒吧街，感受老北京烟火气

5. 三里屯 / 王府井 / 前门大栅栏
   · 购物、老字号美食、北京烤鸭一站全搞定，推荐全聚德或便宜坊
   · 稻香村认准"三禾标志"的北京稻香村，买特产不踩雷

要不要我继续给你按天数排一个具体行程？😊`
  }
  if (/上海/.test(msg) && /美食|吃/.test(msg)) {
    return `上海好吃的真的太多啦，给你分区域推荐👇

🍜 本帮菜 & 老字号
· 老吉士（天平路）：地道本帮红烧肉、葱烤鲫鱼，很多明星打卡
· 老正兴：油爆虾、八宝鸭、草头圈子，人均 120 左右
· 南翔馒头店（豫园）：蟹粉小笼，趁热吃配姜丝醋

🥘 本帮小吃 & 早点
· 生煎：大壶春（无汤生煎，老式发面）、小杨生煎（汤汁多）
· 锅贴 + 咖喱牛肉汤：推荐"晓燕生煎"或"舒蔡记"
· 葱油饼：阿大葱油饼（茂名南路），排队也要吃
· 鲜肉月饼：真老大房、沈大成，中秋前后爆火

🌶️ 各地 & 异国
· 武康路 / 安福路 / 永康路：各种精品咖啡、Brunch、西班牙 Tapas、意大利菜聚集
· 寿喜烧：MO-MO牧场，性价比高
· 日料：古北仙霞路一条街很多居酒屋

🍰 甜品 & 咖啡
· 红宝石：奶油小方，上海人从小吃到大的国民蛋糕
· 国际饭店西饼屋：蝴蝶酥必买伴手礼
· Manner / Seesaw / % Arabica：本地精品咖啡代表

需要我按你的预算和位置给你排一个美食地图吗？😋`
  }
  if (/成都/.test(msg) && /攻略|三日|行程/.test(msg)) {
    return `成都三日游经典安排，巴适得很👇

🐼 Day 1 · 市区经典
上午：大熊猫繁育研究基地（一定要早上 8 点前去，下午熊猫都在睡！）→ 花花、和叶人气高
中午：附近吃"陈麻婆豆腐"（青华路总店）
下午：宽窄巷子（逛逛就好，买特产不如去红旗连锁）→ 人民公园鹤鸣茶社喝盖碗茶 + 采耳
晚上：锦里古街夜景，吃三大炮、蛋烘糕、担担面

🗿 Day 2 · 历史 + 都江堰
上午：成都博物馆 / 四川博物院（都免费，提前预约），看看三星堆青铜器
中午：春熙路吃龙抄手总店（套餐能一次吃到 10 种小吃）
下午：地铁 2 小时到都江堰（青城山 + 都江堰景区联票），鱼嘴、宝瓶口、飞沙堰很震撼
晚上：回成都吃蜀大侠/海底捞/小龙坎火锅，微辣起步别逞强

🍵 Day 3 · 文艺 + 吃
上午：东郊记忆（老厂房改造文创园，拍照好看）→ U37 创意仓库
中午：玉林路吃"明婷饭店"（苍蝇馆子天花板，脑花豆腐、水豆豉爆腰花）
下午：武侯祠（三国迷推荐）+ 锦里隔壁，逛逛"玉林西路"（赵雷《成都》小酒馆打卡）
晚上：九眼桥酒吧街 or 兰桂坊，夜生活走一个

🎒 小贴士
· 必吃清单：火锅、串串香、冒菜、钵钵鸡、糖油果子、冰粉、凉糕
· 伴手礼：张飞牛肉、蜀绣、郫县豆瓣（鹃城牌）、蒲江米花糖
· 住宿推荐：春熙路/太古里商圈，去哪里都近

需要我细化某一天或者根据你的预算调一下吗？😊`
  }
  if (/保险|旅行保险/.test(msg)) {
    return `旅行保险怎么选，我给你讲清楚👇

📋 旅行保险核心保什么
1. 医疗类：意外身故/伤残、突发疾病医疗（含既往症要看条款）
2. 救援类：紧急医疗运送、亲属慰问探访、遗体送返（国外游非常重要）
3. 财物类：行李丢失/延误、证件丢失补办事宜
4. 行程类：航班延误/取消、行程变更、目的地突发紧急情况

✈️ 怎么按出行类型挑
· 国内短途 1-3 天：买一份 20-40 元的综合险就够，重点看意外医疗 + 航班延误
· 国内长途 + 高风险运动（滑雪、潜水、登山）：一定要选"含高风险运动"的，普通意外险不保这些
· 出境游：申根签必须 ≥3 万欧元医疗保额，美亚/安联/史带的出境险口碑好，看清楚"含紧急救援"
· 自驾游：加一份车上财物险，以及道路救援（拖车、换胎、送油）

⚠️ 容易踩的坑
· 投保前看"免责条款"：高原反应、潜水跳伞、怀孕 28 周后通常不赔或限制
· 生效时间：很多是次日 0 点生效，出发前一天要提前买好
· 既往症：心脑血管、慢性病急性发作要看是否"包含突发急性病"
· 理赔资料：医院发票原件、警察局报案单（财物丢失）、延误证明（航司开）别丢

🧮 预算参考
· 国内 3-5 天：30-80 元/人
· 东南亚 5-7 天：80-150 元/人
· 欧美 10 天：250-500 元/人（含申根要求）

推荐你把目的地、天数、同行人的年龄/身体状况告诉我，我帮你挑具体险种组合😉`
  }

  // 默认回答，通用话术
  return `我是你的 AI 旅游助手，可以帮你做这些事👇

📍 行程规划
· 输入城市 + 天数 + 预算，我会给你排好玩儿不累的行程（例："杭州 3 天 3000 预算"）
· 支持亲子游、情侣游、独自旅行、毕业游、爸妈旅行等不同人群

🍜 美食 & 住宿推荐
· 推荐当地不踩雷的老字号、网红打卡、商圈攻略
· 按你的预算筛选酒店/民宿区域

📝 实用攻略
· 签证怎么办理、机票提前多久买最划算
· 什么季节去最合适、穿搭建议、行李清单

🎫 门票 & 避坑
· 热门景点要不要提前预约、什么时间点体验最好
· 哪些是网红坑、哪些是真值得去

直接告诉我你想去哪，咱们开始规划吧～😊`
}

export async function streamChat(options) {
  const { message, history, runId, onChunk, onDone, onError, signal } = options || {}
  let finished = false
  let abortedByUser = false

  const finishWithError = (err) => {
    if (finished) return
    finished = true
    if (typeof onError === 'function') {
      onError(err, runId)
    } else if (typeof onDone === 'function') {
      onDone(runId)
    }
  }

  const finishOk = () => {
    if (finished) return
    finished = true
    if (typeof onDone === 'function') onDone(runId)
  }

  try {
    await sseRequest('/api/chat/stream', {
      body: {
        message: message || '',
        history: history || []
      },
      onChunk: (chunk) => {
        if (signal && signal.aborted) {
          abortedByUser = true
          return
        }
        if (typeof onChunk === 'function') onChunk(chunk, runId)
      },
      onDone: () => finishOk(),
      onError: (err) => {
        // 如果是接口不存在等错误，降级为 mock 流式
        startMockFallback(err)
      },
      signal
    })
  } catch (err) {
    startMockFallback(err)
  }

  function startMockFallback(err) {
    if (finished) return
    const full = buildMockReply(message)
    const chunkSize = 2 // 每次吐 2-3 个字符，模拟打字机速度
    let i = 0
    const tick = () => {
      if (finished) return
      if (signal && signal.aborted) {
        abortedByUser = true
        finishOk()
        return
      }
      if (i >= full.length) {
        finishOk()
        return
      }
      const end = Math.min(full.length, i + chunkSize + Math.floor(Math.random() * 2))
      const chunk = full.slice(i, end)
      i = end
      if (typeof onChunk === 'function') onChunk(chunk, runId)
      setTimeout(tick, 30 + Math.floor(Math.random() * 30))
    }
    // 首次吐出稍微延迟一下，模拟网络连接
    setTimeout(tick, 250)
  }
}
