export async function sseRequest(url, options) {
  const { body, onChunk, onDone, onError, signal } = options || {}

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || undefined
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(
        `接口不存在 (HTTP ${res.status})${errText ? `: ${errText.slice(0, 80)}` : ''}`
      )
    }

    const reader = res.body ? res.body.getReader() : null
    if (!reader) {
      throw new Error('当前浏览器不支持流式读取 (ReadableStream)')
    }

    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const str = decoder.decode(value || new Uint8Array(), { stream: true })
      buffer += str

      let idx
      // SSE 标准：多个事件以 \n\n 分隔
      while ((idx = buffer.indexOf('\n\n')) >= 0) {
        const rawEvent = buffer.slice(0, idx)
        buffer = buffer.slice(idx + 2)
        const lines = rawEvent.split('\n')
        for (const line of lines) {
          if (!line) continue
          if (line.startsWith('data:')) {
            const payload = line.slice(5).replace(/^\s/, '')
            if (payload === '[DONE]') continue
            let chunk = payload
            // 兼容 JSON 包一层 { content: 'xxx' } 的情况
            if (payload.trim().startsWith('{')) {
              try {
                const obj = JSON.parse(payload)
                if (obj && typeof obj.content === 'string') chunk = obj.content
                else if (obj && typeof obj.data === 'string') chunk = obj.data
                else if (obj && typeof obj.delta === 'string') chunk = obj.delta
              } catch {
                // 不是 JSON，按原文输出
              }
            }
            if (chunk && typeof onChunk === 'function') {
              onChunk(chunk)
            }
          }
        }
      }
    }

    // 收尾：如果 buffer 里还有剩余（后端最后没吐 \n\n），再处理一次
    if (buffer.trim()) {
      const lines = buffer.split('\n')
      for (const line of lines) {
        if (!line) continue
        if (line.startsWith('data:')) {
          const payload = line.slice(5).replace(/^\s/, '')
          if (payload && payload !== '[DONE]') {
            let chunk = payload
            if (payload.trim().startsWith('{')) {
              try {
                const obj = JSON.parse(payload)
                if (obj && typeof obj.content === 'string') chunk = obj.content
                else if (obj && typeof obj.data === 'string') chunk = obj.data
              } catch { /* ignore */ }
            }
            if (chunk && typeof onChunk === 'function') onChunk(chunk)
          }
        }
      }
    }

    if (typeof onDone === 'function') onDone()
  } catch (err) {
    // 如果是用户主动 abort，不抛错误
    if (err && err.name === 'AbortError') {
      if (typeof onDone === 'function') onDone()
      return
    }
    if (typeof onError === 'function') onError(err)
    else throw err
  }
}
