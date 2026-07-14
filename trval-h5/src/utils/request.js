import axios from 'axios'

const request = axios.create({
    baseURL: '',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

request.interceptors.request.use(
    (config) => {
        // TODO: 后续如果有登录态，统一在这里加 Authorization
        // const token = localStorage.getItem('token')
        // if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

request.interceptors.response.use(
    (response) => {
        const body = response.data
        // 兼容后端常见包装：{ code, data, msg } 或 { data, message, success }
        // 如果后端直接返回 data（没包装），就原样返回。
        if (body && typeof body === 'object') {
            const hasCode = typeof body.code !== 'undefined'
            const hasSuccess = typeof body.success !== 'undefined'
            if (hasCode || hasSuccess) {
                const ok = hasSuccess
                    ? body.success
                    : String(body.code) === '0' || String(body.code) === '200' || String(body.code) === '1'
                if (ok) {
                    return typeof body.data !== 'undefined' ? body.data : body
                }
                // 业务失败：抛出 message 供上层处理
                const errMsg = body.msg || body.message || '请求失败'
                return Promise.reject(new Error(errMsg))
            }
        }
        return body
    },
    (error) => {
        // HTTP 级错误：超时 / 404 / 500 / 网络断开
        let msg = error && error.message ? error.message : '网络异常，请稍后重试'
        if (error && error.response) {
            const { status, statusText } = error.response
            if (status === 401) msg = '登录已过期，请重新登录'
            else if (status === 403) msg = '没有权限访问'
            else if (status === 404) msg = `接口不存在 (HTTP 404)`
            else if (status >= 500) msg = `服务器异常 (HTTP ${status})`
            else if (statusText) msg = `${statusText} (HTTP ${status})`
        } else if (msg && msg.indexOf('timeout') > -1) {
            msg = '请求超时，请稍后重试'
        }
        const err = new Error(msg)
        if (error && error.response) {
            err.status = error.response.status
        }
        return Promise.reject(err)
    }
)

export default request
