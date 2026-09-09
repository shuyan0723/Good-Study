import './ResultPanel.css';

// 🔧 Bug 判断提示组件：根据请求结果自动给出排查思路
function BugJudgeHint({ result }) {
  if (!result) return null;

  const hints = [];
  if (result.status === 0 && result.errorType === 'NETWORK') {
    hints.push('✅ Network 面板里请求根本没发出去（或红色 Failed）→ 90% 是后端问题：后端没启动 / 端口错了 / CORS 没开');
  }
  if (result.status === 0 && result.errorType === 'TIMEOUT') {
    hints.push('✅ 请求发出去了但迟迟没响应 → 后端慢 / 数据库锁了 / 死循环。看后端日志');
  }
  if (result.status === 500) {
    hints.push('✅ HTTP 500 = 后端崩了 → 看后端 console 里的错误堆栈，这是后端 bug');
  }
  if (result.status === 401 || result.status === 403) {
    hints.push('✅ HTTP 401/403 = 鉴权问题 → 检查前端有没有带 token，后端有没有验 token');
  }
  if (result.status === 400 || result.status === 422) {
    hints.push('✅ HTTP 400/422 = 参数校验失败 → 看响应体里的错误信息，可能是前端传的字段名不对/类型不对');
  }
  if (result.status >= 200 && result.status < 300) {
    hints.push('✅ HTTP 2xx = 后端正常返回了 → 如果页面显示不对，检查前端有没有正确读取响应字段（比如 data.data）');
  }
  if (result.errorType === 'FRONTEND') {
    hints.push('✅ 请求根本没发出去 → 100% 是前端 bug！打开 Console 面板看红色报错');
  }

  return (
    <div className="bug-judge-hint">
      <b>🎓 排查思路：</b>
      <ul>
        {hints.map((h, i) => <li key={i}>{h}</li>)}
        <li>🔑 <b>黄金法则</b>：打开 F12 → Network 面板 → 点按钮 → 看请求状态：
          <br />• <b>请求没发出去（Failed / (canceled)）</b> → 前端问题 或 后端没启动
          <br />• <b>请求发了但状态码是红色的 500</b> → 后端问题
          <br />• <b>请求发了且 200，但数据不对</b> → 要么后端逻辑错，要么前端取值错
        </li>
      </ul>
    </div>
  );
}

export default function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <div className="card">
      <h2>📡 最近一次请求结果：{result.title}</h2>
      <div className="meta">
        {result.status > 0 ? (
          <span className={`tag ${result.ok ? 'tag-success' : 'tag-error'}`}>
            HTTP {result.status}
          </span>
        ) : (
          <span className="tag tag-error">❌ 请求未到达服务器</span>
        )}
        <span className="tag tag-info">耗时 {result.duration}ms</span>
        {result.errorType && (
          <span className="tag tag-error">错误类型: {result.errorType}</span>
        )}
      </div>

      {result.errorMsg && (
        <div className="error-msg-box">
          ⚠️ {result.errorMsg}
        </div>
      )}

      {result.data !== null && (
        <div>
          <div className="response-label">响应体：</div>
          <pre className="result-box">{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}

      <BugJudgeHint result={result} />
    </div>
  );
}
