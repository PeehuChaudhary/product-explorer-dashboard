import React from "react";
import { useEffect, useMemo, useState } from "react";

const API_URL = "https://dummyjson.com/products?limit=0";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState("all");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("The server could not load products. Please try again.");
      }

      const data = await response.json();
      if (!Array.isArray(data.products)) {
        throw new Error("The API returned data in an unexpected format.");
      }

      setProducts(data.products);
    } catch (err) {
      setError(err.message || "Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((item) => item.category))].sort();
  }, [products]);

  const visibleProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter((item) =>
        `${item.title} ${item.description} ${item.brand || ""}`
          .toLowerCase()
          .includes(term)
      );
    }

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    if (minRating !== "all") {
      result = result.filter((item) => item.rating >= Number(minRating));
    }

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "name") result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [products, search, category, minRating, sortBy]);

  const averageRating = products.length
    ? (products.reduce((sum, item) => sum + item.rating, 0) / products.length).toFixed(1)
    : "—";

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setSortBy("featured");
    setMinRating("all");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Product Explorer home">
          <span className="brand-mark">P</span>
          <span>product<span className="brand-light">space</span></span>
        </a>
        <div className="topbar-right">
          <span className="live-dot"></span>
          <span>Live API data</span>
          <span className="avatar">P</span>
        </div>
      </header>

      <main className="main-content">
        <section className="intro">
          <div>
            <p className="eyebrow">YOUR CATALOGUE, AT A GLANCE</p>
            <h1>Product Explorer</h1>
            <p className="subtitle">
              Browse the collection, find what you need, and sort it your way.
            </p>
          </div>
          <button className="refresh-button" onClick={loadProducts} disabled={loading}>
            <span aria-hidden="true">↻</span> {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </section>

        <section className="stats-grid" aria-label="Dashboard summary">
          <article className="stat-card">
            <span className="stat-label">Products available</span>
            <strong>{loading ? "…" : products.length}</strong>
            <span className="stat-note">Items returned by the API</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Categories</span>
            <strong>{loading ? "…" : categories.length}</strong>
            <span className="stat-note">Different product groups</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Average rating</span>
            <strong>{loading ? "…" : `★ ${averageRating}`}</strong>
            <span className="stat-note">Across loaded products</span>
          </article>
        </section>

        <section className="catalogue-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE THE CATALOGUE</p>
              <h2>All products <span className="count">({visibleProducts.length})</span></h2>
            </div>
            <span className="data-source">Source: DummyJSON</span>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search by product, brand or keyword..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label className="select-wrap">
              <span className="sr-only">Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll("-", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="select-wrap">
              <span className="sr-only">Minimum rating</span>
              <select value={minRating} onChange={(event) => setMinRating(event.target.value)}>
                <option value="all">Any rating</option>
                <option value="4">4.0 and above</option>
                <option value="4.5">4.5 and above</option>
              </select>
            </label>

            <label className="select-wrap sort-select">
              <span className="sr-only">Sort products</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="rating">Top rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          {(search || category !== "all" || minRating !== "all" || sortBy !== "featured") && (
            <div className="filter-summary">
              <span>Showing filtered results</span>
              <button onClick={clearFilters}>Clear filters ×</button>
            </div>
          )}

          {loading && (
            <div className="status-panel">
              <div className="spinner"></div>
              <h3>Getting the catalogue ready</h3>
              <p>Fetching the latest sample product data...</p>
            </div>
          )}

          {!loading && error && (
            <div className="status-panel error-panel">
              <div className="status-icon">!</div>
              <h3>Could not load products</h3>
              <p>{error}</p>
              <button className="primary-button" onClick={loadProducts}>Try again</button>
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <div className="status-panel">
              <div className="status-icon">⌕</div>
              <h3>No products found</h3>
              <p>Try a different search term or remove some filters.</p>
              <button className="primary-button" onClick={clearFilters}>Reset filters</button>
            </div>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = "https://placehold.co/500x380/f2f0eb/777?text=Image+not+available";
                      }}
                    />
                    <span className="category-pill">{product.category.replaceAll("-", " ")}</span>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span>{product.brand || "Everyday pick"}</span>
                      <span className="rating">★ {product.rating.toFixed(1)}</span>
                    </div>
                    <h3>{product.title}</h3>
                    <p className="description">{product.description}</p>
                    <div className="card-bottom">
                      <strong>${product.price.toFixed(2)}</strong>
                      <span className={product.stock > 0 ? "stock" : "out-stock"}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <div>
            <span className="footer-brand">productspace</span>
            <p>A small React project built to explore API data.</p>
          </div>
          <p>
            Product data provided by{" "}
            <a href="https://dummyjson.com/" target="_blank" rel="noreferrer">DummyJSON</a>.
            {" "}Sample data for demonstration only.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
