// 🔑 统一的请求工具：封装 fetch + 超时控制 + 错误分类
// 前端可以类比成 axios，但我们自己写一个轻量的

/**
 * @param {string} baseUrl - 后端基础地址
 * @returns {(path: string, options?: RequestInit) => Promise<object>}
 */
export function createRequest(baseUrl) {
  return async function request(path, options = {}) {
    const url = baseUrl + path;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const start = Date.now();
    let status = 0;
    let duration = 0;

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...options.headers },
      });
      clearTimeout(timeoutId);
      duration = Date.now() - start;
      status = res.status;

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      return { ok: res.ok, status, duration, data, raw: text };
    } catch (err) {
      clearTimeout(timeoutId);
      duration = Date.now() - start;

      let errorType = "UNKNOWN";
      let errorMsg = err.message;

      if (err.name === "AbortError") {
        errorType = "TIMEOUT";
        errorMsg = `请求超时（超过 5 秒）—— 可能是后端慢或网络问题`;
      } else if (
        err.message?.includes("Failed to fetch") ||
        err.name === "TypeError"
      ) {
        errorType = "NETWORK";
        errorMsg = `网络请求失败 —— 可能是：①后端未启动 ②CORS 跨域被拦截 ③地址写错`;
      }

      return { ok: false, status, duration, errorType, errorMsg, data: null };
    }
  };
}
