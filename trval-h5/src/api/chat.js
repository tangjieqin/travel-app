import { sseRequest } from '../utils/sse'

export async function streamChat(options) {
  const { message, history, runId, onChunk, onDone, onError, signal } = options || {}
  let finished = false

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

  await sseRequest('/api/chat/stream', {
    body: {
      message: message || '',
      history: history || []
    },
    onChunk: (chunk) => {
      if (signal && signal.aborted) {
        finishOk()
        return
      }
      if (typeof onChunk === 'function') onChunk(chunk, runId)
    },
    onDone: () => finishOk(),
    onError: (err) => finishWithError(err),
    signal
  })
}