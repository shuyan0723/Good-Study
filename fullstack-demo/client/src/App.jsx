import { useState, useCallback, useMemo } from 'react';
import { createRequest } from './api/request';
import { API_BASE } from './config';
import ConfigPanel from './components/ConfigPanel';
import ProductSection from './components/ProductSection';
import BugDemoSection from './components/BugDemoSection';
import ResultPanel from './components/ResultPanel';

export default function App() {
  const [backendUrl, setBackendUrl] = useState(API_BASE);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [products, setProducts] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  // � 用 useMemo 创建请求函数，backendUrl 变了才重建
  const request = useMemo(() => createRequest(backendUrl), [backendUrl]);

  // ========== 业务操作 ==========

  const loadProducts = useCallback(async () => {
    const result = await request('/products');
    setLastResult({ title: 'GET /products（获取商品列表）', ...result });
    if (result.ok && result.data?.data) {
      setProducts(result.data.data);
    }
  }, [request]);

  const createProduct = useCallback(async () => {
    if (!productName || !productPrice) {
      alert('请填写商品名和价格');
      return;
    }
    const result = await request('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: productName,
        price: Number(productPrice),
        description: productDesc || undefined,
      }),
    });
    setLastResult({ title: 'POST /products（创建商品）', ...result });
    if (result.ok) {
      setProductName(''); setProductPrice(''); setProductDesc('');
      loadProducts();
    }
  }, [request, productName, productPrice, productDesc, loadProducts]);

  const createBadProduct = useCallback(async () => {
    const result = await request('/products', {
      method: 'POST',
      body: JSON.stringify({ name: '测试商品', price: -999 }),
    });
    setLastResult({ title: 'POST /products（故意传错参数）', ...result });
  }, [request]);

  // ========== Bug 演示 ==========

  const testBugApi = useCallback(async (key, path) => {
    const labelMap = {
      slow: 'GET /bug/timeout（慢接口，后端延迟 3 秒）',
      crash: 'GET /bug/crash（后端故意抛出异常，返回 500）',
      format: 'GET /bug/format（后端返回格式不统一）',
      unauth: 'GET /bug/unauthorized（未带 token，返回 401）',
    };
    const result = await request(path);
    setLastResult({ title: labelMap[key] || path, ...result });
  }, [request]);

  const triggerFrontendCrash = useCallback(() => {
    setLastResult({
      title: '前端自己崩的（不是后端问题！）',
      ok: false, status: 0, duration: 0, errorType: 'FRONTEND', data: null,
      errorMsg: '如果请求还没发出去就报错（Network 面板没看到请求），那就是前端的锅！比如代码里写了 undefined.xxx',
    });
  }, []);

  return (
    <div className="container">
      <h1>🎯 全栈 Demo：React + Nest.js</h1>
      <p className="subtitle">
        前端在 <b>http://localhost:5173</b>，后端在 <b>http://localhost:3000</b>
        <br />
        核心教学点：打开浏览器 <b>F12 → Network 面板</b>，每次点按钮观察请求/响应 → 你就会排查 bug 了！
      </p>

      <ConfigPanel
        backendUrl={backendUrl}
        setBackendUrl={setBackendUrl}
        defaultUrl={API_BASE}
      />

      <ProductSection
        products={products}
        loadProducts={loadProducts}
        productName={productName} setProductName={setProductName}
        productPrice={productPrice} setProductPrice={setProductPrice}
        productDesc={productDesc} setProductDesc={setProductDesc}
        createProduct={createProduct}
        createBadProduct={createBadProduct}
      />

      <BugDemoSection
        onTestApi={testBugApi}
        onFrontendCrash={triggerFrontendCrash}
      />

      <ResultPanel result={lastResult} />
    </div>
  );
}
