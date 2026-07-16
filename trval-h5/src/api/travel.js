import request from '../utils/request'

export async function getTravelRecommend(params) {
  const { destination, budget, days } = params || {}
  const payload = {
    city: destination || '',
    budget: Number(budget) || 0,
    days: Number(days) || 0,
  }

  const data = await request.post('/api/travel/recommend', payload)
  return { ok: true, data }
}