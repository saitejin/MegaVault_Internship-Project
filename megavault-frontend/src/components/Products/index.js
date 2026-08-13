import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../components/common/ProductCard";
import { allProductsData, categoriesData } from "../../utils/mockData";
import "./index.css";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCategory = searchParams.get("category") || "all";
  const searchQueryParam = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(searchCategory);
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState(0);

  const filteredProducts = useMemo(() => {
    return allProductsData
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" ||
          product.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === "smart-home" && product.category === "Smart Home") ||
          (selectedCategory === "electronics" && product.category === "Electronics") ||
          (selectedCategory === "wearables" && product.category === "Wearables") ||
          (selectedCategory === "gaming" && product.category === "Gaming") ||
          (selectedCategory === "fashion" && product.category === "Fashion") ||
          (selectedCategory === "audio" && product.category === "Audio");

        const matchesSearch =
          !searchQuery.trim() ||
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice = product.price <= priceRange;
        const matchesRating = product.rating >= minRating;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [selectedCategory, searchQuery, priceRange, sortBy, minRating]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-megavault mb-2">Explore All ({allProductsData.length} Items)</span>
          <h2 className="fw-bold font-heading mb-1 text-main">Shop Product Catalog</h2>
          <p className="text-muted mb-0">Browse our inventory across 6 departments in Indian Rupees (₹).</p>
        </div>

        <div style={{ maxWidth: "320px" }} className="w-100">
          <div className="input-group">
            <span className="input-group-text glass-card border-end-0 border-secondary text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control glass-card border-start-0 border-secondary text-main"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="glass-card p-4 sticky-top" style={{ top: "90px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
              <h5 className="fw-bold font-heading mb-0"><i className="bi bi-funnel-fill text-primary me-2"></i>Filters</h5>
              <button 
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setPriceRange(100000);
                  setMinRating(0);
                  setSortBy("featured");
                }}
                className="btn btn-sm text-primary p-0 font-heading fw-semibold"
              >
                Reset All
              </button>
            </div>

            <div className="mb-4">
              <label className="form-label font-heading fw-bold small text-muted text-uppercase mb-2">Categories</label>
              <div className="d-flex flex-column gap-1">
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`btn btn-sm text-start font-heading border-0 py-2 px-3 rounded-3 d-flex justify-content-between align-items-center ${
                    selectedCategory === "all" ? "btn-megavault" : "text-main hover-bg"
                  }`}
                >
                  <span>All Products</span>
                  <span className="badge bg-secondary rounded-pill">{allProductsData.length}</span>
                </button>
                {categoriesData.map((cat) => {
                  const count = allProductsData.filter(p => p.category.toLowerCase().includes(cat.id) || (cat.id === "audio" && p.category === "Audio")).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`btn btn-sm text-start font-heading border-0 py-2 px-3 rounded-3 d-flex justify-content-between align-items-center ${
                        selectedCategory === cat.id ? "btn-megavault" : "text-main hover-bg"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="badge bg-secondary rounded-pill">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label font-heading fw-bold small text-muted text-uppercase mb-0">Max Price</label>
                <span className="fw-bold text-primary font-heading">₹{priceRange.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="999"
                max="100000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label font-heading fw-bold small text-muted text-uppercase mb-2">Rating</label>
              <select className="form-select glass-card border-secondary text-main" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value="0">All Ratings</option>
                <option value="4.5">⭐ 4.5 & Above</option>
                <option value="4.7">⭐ 4.7 & Above</option>
                <option value="4.9">⭐ 4.9 Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="glass-card p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="text-muted small font-heading">
              Showing <strong className="text-main">{filteredProducts.length}</strong> of {allProductsData.length} products
            </span>

            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted font-heading text-nowrap">Sort By:</label>
              <select 
                className="form-select form-select-sm glass-card border-secondary text-main font-heading" 
                style={{ width: "160px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="glass-card p-5 text-center my-4">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <h4 className="fw-bold font-heading">No Products Found</h4>
              <p className="text-muted">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-xl-4 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
