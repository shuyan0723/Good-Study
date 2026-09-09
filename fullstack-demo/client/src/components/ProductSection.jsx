import './ProductSection.css';

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
        <div className="product-list product-list-top">
          {products.map(p => (
            <div key={p.id} className="product-item">
              <span>🆕 {p.name} <small className="product-desc">{p.description}</small></span>
              <span className="price">¥{p.price}</span>
            </div>
          ))}
        </div>
      )}

      <hr className="product-divider" />

      <div className="product-form">
        <input placeholder="商品名" value={productName} onChange={e => setProductName(e.target.value)} />
        <input placeholder="价格" type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
        <input className="product-input-desc" placeholder="描述（可选）" value={productDesc} onChange={e => setProductDesc(e.target.value)} />
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
