import { useState, useCallback } from 'react';

// 🔑 后端 API 地址（可修改来测试"后端挂了"的场景）
const API_BASE = 'http://localhost:3000';

export default function App() {
  const [backendUrl, setBackendUrl] = useState(API_BASE);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [products, setProducts] = useState([]);

  // 每次请求的结果展示
  const [lastResult, setLastResult] = useState(null);

  // 🔧 核心：统一的请求函数（fetch + 超时 + 错误处理）
  const request = useCallback(async (path, options = {}) => {
    const url = backendUrl + path;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

    const start = Date.now();
    let status = 0;
    let duration = 0;

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });
      clearTimeout(timeoutId);
      duration = Date.now() - start;
      status = res.status;

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      return { ok: res.ok, status, duration, data, raw: text };
    } catch (err) {
      clearTimeout(timeoutId);
      duration = Date.now() - start;

      // 🔑 关键：区分 CORS 错误 / 超时 / 网络错误
      let errorType = 'UNKNOWN';
      let errorMsg = err.message;
      if (err.name === 'AbortError') {
        errorType = 'TIMEOUT';
        errorMsg = `请求超时（超过 5 秒）—— 可能是后端慢或网络问题`;
      } else if (err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
        errorType = 'NETWORK';
        // 🔑 这是联调最常见的两种情况：
        // 1. 后端根本没启动（连接被拒绝）
        // 2. 后端没开 CORS（跨域被浏览器拦截）
        errorMsg = `网络请求失败 —— 可能是：①后端未启动 ②CORS 跨域被拦截 ③地址写错`;
      }

      return { ok: false, status, duration, errorType, errorMsg, data: null };
    }
  }, [backendUrl]);

  // ========== 正常业务调用 ==========

  const loadProducts = async () => {
    const result = await request('/products');
    setLastResult({ title: 'GET /products（获取商品列表）', ...result });
    if (result.ok && result.data?.data) {
      setProducts(result.data.data);
    }
  };

  const createProduct = async () => {
    if (!productName || !productPrice) {
      alert('请填写商品名和价格');
      return;
    }
    const result = await request('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: productName,
        price: Number(productPrice), // 🔑 前端转数字
        description: productDesc || undefined,
      }),
    });
    setLastResult({ title: 'POST /products（创建商品）', ...result });
    if (result.ok) {
      setProductName(''); setProductPrice(''); setProductDesc('');
      loadProducts(); // 刷新列表
    }
  };

  // 故意传错误数据（比如 price 是负数或非数字）
  const createBadProduct = async () => {
    const result = await request('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: '测试商品',
        price: -999, // 🔑 故意传负数，触发后端校验错误
      }),
    });
    setLastResult({ title: 'POST /products（故意传错参数）', ...result });
  };

  // ========== Bug 演示调用 ==========

  const testSlowApi = async () => {
    const result = await request('/bug/timeout'); // 后端要等 3s，前端超时 5s 以内能收到
    setLastResult({ title: 'GET /bug/timeout（慢接口，后端延迟 3 秒）', ...result });
  };

  const testCrashApi = async () => {
    const result = await request('/bug/crash');
    setLastResult({ title: 'GET /bug/crash（后端故意抛出异常，返回 500）', ...result });
  };

  const testFormatApi = async () => {
    const result = await request('/bug/format');
    setLastResult({ title: 'GET /bug/format（后端返回格式不统一）', ...result });
  };

  const testUnauthorizedApi = async () => {
    const result = await request('/bug/unauthorized'); // 没带 token
    setLastResult({ title: 'GET /bug/unauthorized（未带 token，返回 401）', ...result });
  };

  // 前端自己崩（演示 bug 在前端的情况）
  const testFrontendCrash = () => {
    setLastResult({
      title: '前端自己崩的（不是后端问题！）',
      ok: false,
      status: 0,
      duration: 0,
      errorType: 'FRONTEND',
      errorMsg: '如果请求还没发出去就报错（Network 面板没看到请求），那就是前端的锅！比如代码里写了 undefined.xxx',
      data: null,
    });
  };

  return (
    <div className="container">
      <h1>🎯 全栈 Demo：React + Nest.js</h1>
      <p className="subtitle">
        前端在 <b>http://localhost:5173</b>，后端在 <b>http://localhost:3000</b>
        <br/>
        核心教学点：打开浏览器 <b>F12 → Network 面板</b>，每次点按钮观察请求/响应 → 你就会排查 bug 了！
      </p>

      {/* ===== 后端地址配置（故意改错来测试"后端挂了"）===== */}
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
        <button className="btn btn-primary" onClick={() => setBackendUrl(API_BASE)}>
          恢复正确地址
        </button>
      </div>

      {/* ===== 正常业务 ===== */}
      <div className="card">
        <h2>✅ 正常业务联调</h2>
        <div>
          <button className="btn btn-primary" onClick={loadProducts}>
            获取商品列表 GET /products
          </button>
        </div>

        {products.length > 0 && (
          <div style={{ marginTop: 12 }} className="product-list">
            {products.map(p => (
              <div key={p.id} className="product-item">
                <span>🆕 {p.name} <small style={{ color: '#888' }}>{p.description}</small></span>
                <span className="price">¥{p.price}</span>
              </div>
            ))}
          </div>
        )}

        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <div style={{ marginBottom: 8 }}>
          <input placeholder="商品名" value={productName} onChange={e => setProductName(e.target.value)} />
          <input placeholder="价格" type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
          <input placeholder="描述（可选）" value={productDesc} onChange={e => setProductDesc(e.target.value)} style={{ width: 200 }} />
        </div>
        <button className="btn btn-primary" onClick={createProduct}>
          创建商品 POST /products
        </button>
        <button className="btn btn-danger" onClick={createBadProduct}>
          故意传错参数（price = -999）
        </button>
      </div>

      {/* ===== Bug 演示区 ===== */}
      <div className="card">
        <h2>🐛 Bug 场景演示</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          点下面的按钮，观察 Network 面板里的请求状态 → 理解"bug 在前端还是后端"
        </p>
        <div>
          <button className="btn btn-warn" onClick={testSlowApi}>⏱️ 慢接口（3秒延迟）</button>
          <button className="btn btn-danger" onClick={testCrashApi}>💥 后端 crash（500）</button>
          <button className="btn btn-danger" onClick={testFormatApi}>📐 格式不统一</button>
          <button className="btn btn-danger" onClick={testUnauthorizedApi}>🔒 未授权（401）</button>
          <button className="btn btn-danger" onClick={testFrontendCrash}>🚫 前端自己崩</button>
        </div>
      </div>

      {/* ===== 请求结果展示 ===== */}
      {lastResult && (
        <div className="card">
          <h2>📡 最近一次请求结果：{lastResult.title}</h2>
          <div className="meta">
            {lastResult.status > 0 ? (
              <span className={`tag ${lastResult.ok ? 'tag-success' : 'tag-error'}`}>
                HTTP {lastResult.status}
              </span>
            ) : (
              <span className="tag tag-error">❌ 请求未到达服务器</span>
            )}
            <span className="tag tag-info">耗时 {lastResult.duration}ms</span>
            {lastResult.errorType && (
              <span className="tag tag-error">错误类型: {lastResult.errorType}</span>
            )}
          </div>

          {lastResult.errorMsg && (
            <div style={{ marginTop: 12, padding: 10, background: '#fff3cd', borderLeft: '3px solid #ffc107', borderRadius: 4, fontSize: 13 }}>
              ⚠️ {lastResult.errorMsg}
            </div>
          )}

          {lastResult.data !== null && (
            <div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 12 }}>响应体：</div>
              <pre className="result-box">{JSON.stringify(lastResult.data, null, 2)}</pre>
            </div>
          )}

          {/* 🔑 关键提示：教用户怎么判断 bug 归属 */}
          <BugJudgeHint result={lastResult} />
        </div>
      )}
    </div>
  );
}

// 🔧 辅助组件：根据请求结果，告诉用户 bug 在哪里
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
    <div style={{ marginTop: 16, padding: 12, background: '#e8f5e9', borderRadius: 6, fontSize: 13, lineHeight: 1.8 }}>
      <b>🎓 排查思路：</b>
      <ul style={{ marginLeft: 20, marginTop: 6 }}>
        {hints.map((h, i) => <li key={i}>{h}</li>)}
        <li>🔑 <b>黄金法则</b>：打开 F12 → Network 面板 → 点按钮 → 看请求状态：
          <br/>• <b>请求没发出去（Failed / (canceled)）</b> → 前端问题 或 后端没启动
          <br/>• <b>请求发了但状态码是红色的 500</b> → 后端问题
          <br/>• <b>请求发了且 200，但数据不对</b> → 要么后端逻辑错，要么前端取值错
        </li>
      </ul>
    </div>
  );
}
