import request from '../utils/request'

function buildMockData({ destination, budget, days }) {
  const dayCount = Number(days) || 3
  const totalBudget = Number(budget) || 1000
  const transportBudget = Math.round(totalBudget * 0.25)
  const hotelBudget = Math.round(totalBudget * 0.35)
  const foodBudget = Math.round(totalBudget * 0.2)
  const ticketsBudget = Math.round(totalBudget * 0.15)
  const otherBudget = totalBudget - transportBudget - hotelBudget - foodBudget - ticketsBudget

  const spotBank = [
    { name: '天安门广场 & 故宫博物院', duration: '3-4 小时', ticket: '故宫门票 60 元（旺季）/ 40 元（淡季）', transport: '地铁 1 号线天安门东或天安门西站下车', desc: '天安门广场是世界上最大的城市广场之一，是北京的象征。故宫博物院（紫禁城）位于天安门北侧，是明清两代的皇家宫殿，也是世界上现存规模最大、保存最为完整的木质结构古建筑之一。建议从午门进入，沿中轴线游览三大殿，再至御花园，感受皇家威仪。' },
    { name: '景山公园', duration: '1-2 小时', ticket: '门票 2 元', transport: '从故宫神武门步行即可到达', desc: '景山公园位于故宫北面，曾是北京城的制高点。登上万春亭，可以俯瞰故宫全景和北京中轴线，是摄影爱好者的绝佳去处。下午时分光线适宜，能拍出金碧辉煌的故宫全景照。' },
    { name: '王府井大街 & 全聚德烤鸭', duration: '2-3 小时', ticket: '餐饮人均 150 元左右', transport: '从景山西门步行或乘坐公交/地铁至灯市口站', desc: '王府井是北京最著名的商业街，拥有百货大楼、北京 apm、工美大厦等，逛街购物之余，可在此品尝地道北京美食。强烈推荐老字号全聚德烤鸭，体验正宗的挂炉烤鸭片皮吃法，搭配薄饼、甜面酱和葱丝，风味十足。' },
    { name: '八达岭长城', duration: '4-6 小时', ticket: '门票 40 元（旺季）/ 35 元（淡季）', transport: '可乘坐 S2 线旅游列车或直达旅游专线大巴', desc: '八达岭长城是明长城中保存最完好、最具代表性的一段。建议早上出发，乘坐缆车或徒步登至"好汉坡"，感受"不到长城非好汉"的壮志豪情。夏季注意防晒补水，冬季需穿防滑保暖鞋。' },
    { name: '鸟巢 & 水立方', duration: '2-3 小时', ticket: '鸟巢 50 元 / 水立方 30 元', transport: '地铁 8 号线奥体中心站或奥林匹克公园站', desc: '2008 年北京奥运会标志性建筑，夜晚灯光亮起时外观绚丽夺目。可入内参观奥运场馆内部，或在奥林匹克公园内漫步拍照，感受国家级体育中心的宏伟气势。' },
    { name: '三里屯太古里', duration: '2-4 小时', ticket: '免费', transport: '地铁 10 号线团结湖站或 2 号线东直门站', desc: '北京最潮的商业休闲区之一，汇聚了国际品牌旗舰店、买手店、咖啡馆和各国美食餐厅。晚上的酒吧街热闹非凡，是体验北京都市夜生活的首选之地。' },
    { name: '颐和园', duration: '3-4 小时', ticket: '门票 30 元（旺季）/ 20 元（淡季），联票 60 元', transport: '地铁 4 号线北宫门站下车即达', desc: '中国现存最大的皇家园林，以昆明湖、万寿山为基址，融合江南园林的精巧与北方皇家园林的雄浑。推荐乘船游昆明湖，登佛香阁远眺，再到长廊欣赏彩绘壁画。' },
    { name: '圆明园遗址公园', duration: '2 小时', ticket: '门票 10 元，遗址区 15 元', transport: '地铁 4 号线圆明园站 B 口出站', desc: '曾被誉为"万园之园"，后在战火中成为遗址公园。西洋楼遗址的断壁残垣具有强烈的历史震撼力，适合带着孩子进行爱国主义教育，也可春夏季赏荷花。' },
    { name: '中关村 & 五道口', duration: '2-3 小时', ticket: '餐饮人均 80-120 元', transport: '地铁 4 号线北京大学东门站 / 13 号线五道口站', desc: '这里是中国硅谷的核心区，清华、北大等顶尖高校环绕，年轻学子与科技精英云集。晚上可在五道口一带品尝韩餐、日料和各种网红小吃，感受青春洋溢的氛围。' },
    { name: '天坛公园', duration: '2-3 小时', ticket: '门票 15 元，联票 34 元', transport: '地铁 5 号线天坛东门站', desc: '明清两代皇帝祭天祈谷的场所，祈年殿的三重檐圆形建筑是其标志性景观。清晨常有附近老人在此打太极、练声，能感受到北京本地人最真实的市井生活气息。' },
    { name: '前门大街 & 大栅栏', duration: '2-3 小时', ticket: '免费', transport: '地铁 2 号线前门站', desc: '百年老字号云集的商业街，全聚德、内联升、同仁堂、都一处等均在此有老店。街上保留着有轨电车"铛铛车"，可乘坐体验；再拐进大栅栏胡同，感受原汁原味的老北京风情。' },
    { name: '什刹海 & 南锣鼓巷', duration: '3-4 小时', ticket: '免费（个别胡同四合院景点需另购门票）', transport: '地铁 6 号线北海北站或 8 号线什刹海站', desc: '老北京胡同和水乡风貌结合的典范。白天可沿后海漫步、参观恭王府（和珅旧宅），在烟袋斜街和南锣鼓巷淘小店、吃小吃；晚上可以在湖边选一家酒吧小坐，或包一条摇橹船游湖。' },
    { name: '返程·送站/送机', duration: '视交通方式而定', ticket: '无', transport: '前往机场 / 火车站', desc: '根据返程时间自由安排，可在酒店周边逛逛买些伴手礼（稻香村糕点、北京果脯、二锅头等），提前出发去机场或火车站，预留充足时间以免误车误机。' },
  ]
  const tipsBank = [
    '故宫门票非常紧俏，务必提前 7 天在官网或微信小程序预约，通常在晚上 8 点放票，建议定好闹钟抢票。珍宝馆和钟表馆可根据兴趣单独购票，展览内容十分丰富。',
    '游览长城建议穿着舒适的运动鞋，攀爬时注意安全，带好饮用水和防晒用品。八达岭景区内售卖餐饮较少，建议自备一些零食和能量棒，以备途中补充体力。',
    '北京地铁线路发达，建议下载"亿通行"APP 或使用支付宝 / 微信乘车码，方便快捷。工作日早晚高峰 7:30-9:30、17:30-19:30 车厢内较为拥挤，可尽量错峰出行。',
    `预算中的"其他"费用预留较充足，可用于购买北京特产（如稻香村糕点、故宫文创、二锅头、茯苓饼）或应对突发情况。老字号推荐去前门大栅栏的总店购买，品种最全且品质有保障。`,
  ]
  const noticesBank = [
    '北京早晚高峰交通拥堵严重，建议尽量选择地铁出行，避免打车延误行程。天安门广场进入需严格安检，请勿携带违禁品（如打火机、超大容量充电宝），并配合工作人员检查。',
    '部分热门区域（如王府井、西单、三里屯、南锣鼓巷）人流量较大，看管好随身贵重物品，手机钱包尽量贴身存放。节假日景点门票紧张，建议提前 3-7 天完成线上预约，以免现场扑空。',
    '北京气候干燥，夏季炎热暴晒需备防晒衣帽、太阳镜和充足饮水；冬季气温较低且多风，需穿羽绒服、戴帽子手套。敏感人群春秋季可备口罩，应对花粉和沙尘天气。',
  ]

  const itinerary = []
  for (let i = 0; i < dayCount; i++) {
    const dayNum = i + 1
    const isLast = dayNum === dayCount
    const morning = spotBank[(i * 3 + 0) % spotBank.length]
    const afternoon = spotBank[(i * 3 + 1) % spotBank.length]
    const evening = isLast
      ? spotBank[spotBank.length - 1]
      : spotBank[(i * 3 + 2) % spotBank.length]

    const buildSegment = (s, period) => ({
      period,
      title: `${destination}·${s.name}`,
      duration: s.duration,
      ticket: s.ticket,
      transport: s.transport,
      desc: s.desc,
    })

    itinerary.push({
      day: dayNum,
      morning: buildSegment(morning, '上午'),
      afternoon: buildSegment(afternoon, '下午'),
      evening: buildSegment(evening, '晚上'),
    })
  }

  const tipsCount = Math.min(4, tipsBank.length)
  const tips = tipsBank.slice(0, tipsCount)

  const noticesCount = Math.min(3, noticesBank.length)
  const notices = noticesBank.slice(0, noticesCount)

  return {
    destination,
    budget: totalBudget,
    days: dayCount,
    title: `${destination}${dayCount}日深度游 · 预算${totalBudget}元`,
    summary: `为您定制的${destination}${dayCount}日行程方案，兼顾经典地标、本地美食与文化体验，整体预算约${totalBudget}元。行程节奏宽松，预留自由调整空间，适合家庭或朋友结伴出行。`,
    highlights: [
      `精选 ${dayCount} 条核心路线，经典与小众景点兼顾`,
      `预算拆分透明：人均约 ${Math.round(totalBudget / 2)}~${Math.round(totalBudget)} 元`,
      '每日景点距离合理，避免长时间往返奔波',
      '含美食街区与特色餐厅推荐'
    ],
    itinerary,
    budgetBreakdown: {
      transport: transportBudget,
      hotel: hotelBudget,
      food: foodBudget,
      tickets: ticketsBudget,
      other: otherBudget,
    },
    tips,
    notices,
  }
}

export async function getTravelRecommend(params) {
  const { destination, budget, days } = params || {}
  const payload = {
    destination: destination || '',
    budget: Number(budget) || 0,
    days: Number(days) || 0,
  }

  try {
    const data = await request.post('/api/travel/recommend', payload)
    if (!data || typeof data !== 'object') {
      throw new Error('empty response')
    }
    return { ok: true, data }
  } catch (err) {
    // 后端接口未实现时，走 mock 兜底保证页面正常展示
    // eslint-disable-next-line no-console
    console.warn(
      '[travel/recommend] 后端接口不可用，使用前端 mock 数据。',
      err && err.message ? `原因：${err.message}` : ''
    )
    const mock = buildMockData(payload)
    return { ok: true, data: mock, mock: true }
  }
}
