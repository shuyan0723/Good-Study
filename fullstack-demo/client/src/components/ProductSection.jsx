export default function ProductSection({
  products,
  loadProducts,
  productName, setProductName,
  productPrice, setProductPrice,
  productDesc, setProductDesc,
  createProduct,
  createBadProduct,
}) {
  return (
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
  );
}
