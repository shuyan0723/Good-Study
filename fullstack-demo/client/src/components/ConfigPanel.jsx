export default function ConfigPanel({ backendUrl, setBackendUrl, defaultUrl }) {
  return (
    <div className="card">
      <h2>🔧 配置区</h2>
      <label>后端地址：</label>
      <input
        value={backendUrl}
        onChange={e => setBackendUrl(e.target.value)}
        style={{ width: 300 }}
      />
      <button className="btn btn-warn" onClick={() => setBackendUrl('http://localhost:9999')}>
        故意改错地址（测试 CORS/网络错误）
      </button>
      <button className="btn btn-primary" onClick={() => setBackendUrl(defaultUrl)}>
        恢复正确地址
      </button>
    </div>
  );
}
