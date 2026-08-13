import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { allProductsData, categoriesData } from '../utils/mockData';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get('budget') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState(100000);
  const [minPrice, setMinPrice] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [minRating, setMinRating] = useState(0);
  const [productsList, setProductsList] = useState(allProductsData);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state dynamically whenever URL searchParams change
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    const urlBudget = searchParams.get('budget') || 'all';
    const urlSearch = searchParams.get('search') || '';
    setSelectedCategory(urlCat);
    setSelectedBudget(urlBudget);
    setSearchQuery(urlSearch);

    // Auto-sync price slider cap if budget parameter is present in URL
    if (urlBudget === 'under-10k') { setMinPrice(0); setPriceRange(10000); }
    else if (urlBudget === 'under-30k') { setMinPrice(0); setPriceRange(30000); }
    else if (urlBudget === 'under-50k') { setMinPrice(0); setPriceRange(50000); }
    else if (urlBudget === 'under-1lakh') { setMinPrice(0); setPriceRange(100000); }
  }, [searchParams]);

  // Exact Category Matcher matching Category ID, Slug, or Name
  const isCategoryMatch = (product, selectedCat) => {
    if (!selectedCat || selectedCat === 'all') return true;
    const sCat = String(selectedCat).toLowerCase().trim();
    const pCatName = String(product.category || '').toLowerCase().trim();
    const pCatId = String(product.categoryId || '').toLowerCase().trim();
    const pCatSlug = String(product.categorySlug || '').toLowerCase().trim();

    if (sCat === '1' || sCat === 'audio') return pCatId === '1' || pCatSlug === 'audio' || pCatName.includes('audio');
    if (sCat === '2' || sCat === 'wearables') return pCatId === '2' || pCatSlug === 'wearables' || pCatName.includes('wearable');
    if (sCat === '3' || sCat === 'gaming') return pCatId === '3' || pCatSlug === 'gaming' || pCatName.includes('gaming');
    if (sCat === '4' || sCat === 'electronics') return pCatId === '4' || pCatSlug === 'electronics' || pCatName.includes('electronic');
    if (sCat === '5' || sCat === 'fashion') return pCatId === '5' || pCatSlug === 'fashion' || pCatName.includes('fashion');
    if (sCat === '6' || sCat === 'smart-home' || sCat === 'smarthome') return pCatId === '6' || pCatSlug === 'smart-home' || pCatName.includes('smart');

    return sCat === pCatId || sCat === pCatSlug || sCat === pCatName || pCatName.includes(sCat);
  };

  // Dedicated Budget Filter Matcher
  const isBudgetMatch = (product, budgetId) => {
    if (!budgetId || budgetId === 'all') return true;
    const price = Number(product.price || 0);
    if (budgetId === 'under-10k') return price <= 10000;
    if (budgetId === 'under-30k') return price <= 30000;
    if (budgetId === 'under-50k') return price <= 50000;
    if (budgetId === 'under-1lakh') return price <= 100000;
    return true;
  };

  // Natural Language Price & Topic Query Parser
  const parseNaturalLanguageSearch = (query) => {
    if (!query || !query.trim()) return { cleanQuery: '', maxPriceCap: null };

    let raw = query.toLowerCase().trim();
    let maxPriceCap = null;

    // Extract price patterns like "under ₹5,000", "under 5000", "below 10k", "under 30000"
    const priceMatch = raw.match(/(?:under|below|less than|within)?\s*(?:₹|rs\.?|inr)?\s*([\d,]+|\d+\s*k|\d+\s*lakh)/i);
    if (priceMatch && (raw.includes('under') || raw.includes('below') || raw.includes('less') || raw.includes('₹') || raw.includes('rs'))) {
      let priceStr = priceMatch[1].replace(/,/g, '').trim();
      if (priceStr.endsWith('k')) {
        maxPriceCap = parseFloat(priceStr.replace('k', '')) * 1000;
      } else if (priceStr.includes('lakh')) {
        maxPriceCap = parseFloat(priceStr.replace('lakh', '')) * 100000;
      } else {
        maxPriceCap = parseFloat(priceStr);
      }
    }

    let cleanQuery = raw
      .replace(/(?:under|below|less than|within|cheap|best|top|\bfor\b|\bwith\b|\bin\b)/g, '')
      .replace(/(?:₹|rs\.?|inr)\s*[\d,]+/g, '')
      .replace(/\b\d+k\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return { cleanQuery, maxPriceCap };
  };

  const isSmartSearchMatch = (product, query) => {
    if (!query || !query.trim()) return true;
    const { cleanQuery, maxPriceCap } = parseNaturalLanguageSearch(query);

    const price = Number(product.price || 0);
    if (maxPriceCap && price > maxPriceCap) {
      return false;
    }

    if (!cleanQuery) return true;

    const title = (product.title || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();
    const code = (product.productCode || '').toLowerCase();
    const slug = (product.categorySlug || '').toLowerCase();

    const synonyms = {
      'headphones': ['headphone', 'headset', 'earphone', 'audio', 'sound', 'wh-ch720n', 'sony'],
      'smartwatches': ['smartwatch', 'watch', 'wearables', 'wearable', 'galaxy watch', 'apple watch', 'noise'],
      'gaming': ['game', 'laptop', 'strix', 'legion', 'victus', 'console', 'controller', 'rgb', 'mouse'],
      'earbuds': ['earbud', 'tws', 'airdopes', 'buds', 'audio', 'airpods'],
      'smart home': ['smart', 'home', 'bulb', 'speaker', 'camera', 'alexa', 'echo', 'plug'],
      'bags': ['bag', 'backpack', 'trolley', 'fashion', 'luggage', 'wildcraft', 'safari']
    };

    const words = cleanQuery.split(' ').filter(w => w.length > 1);

    return words.every(word => {
      if (title.includes(word) || desc.includes(word) || cat.includes(word) || code.includes(word) || slug.includes(word)) {
        return true;
      }
      for (const [key, synList] of Object.entries(synonyms)) {
        if (key.includes(word) || word.includes(key)) {
          if (synList.some(syn => title.includes(syn) || cat.includes(syn) || desc.includes(syn) || slug.includes(syn))) {
            return true;
          }
        }
      }
      return false;
    });
  };

  // Main Reactive Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        const price = Number(product.price || 0);

        // 1. Department Category Filter
        const matchesCategory = isCategoryMatch(product, selectedCategory);

        // 2. Budget Parameter Matcher
        const matchesBudget = isBudgetMatch(product, selectedBudget);

        // 3. Search Bar Filter (Smart Natural Language Search)
        const matchesSearch = isSmartSearchMatch(product, searchQuery);

        // 4. Max Price Cap Slider Filter
        const matchesPrice = price >= minPrice && price <= priceRange;

        // 5. Rating Filter
        const matchesRating = Number(product.rating || 0) >= minRating;

        return matchesCategory && matchesBudget && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured default
      });
  }, [productsList, selectedCategory, selectedBudget, searchQuery, minPrice, priceRange, sortBy, minRating]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleSliderChange = (newVal) => {
    setPriceRange(newVal);
    if (selectedBudget !== 'all') {
      setSelectedBudget('all');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('budget');
      setSearchParams(newParams);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBudget('all');
    setSearchQuery('');
    setMinPrice(0);
    setPriceRange(100000);
    setMinRating(0);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="py-3">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-megavault mb-2">Catalog ({allProductsData.length} Items)</span>
          <h2 className="fw-bold font-heading mb-1 text-main">Shop Product Catalog</h2>
          <p className="text-muted mb-0">Browse catalog items with precision price filters and department categories in INR (₹).</p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '320px' }} className="w-100">
          <div className="input-group input-group-glass">
            <span className="input-group-text text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control text-main"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                const newParams = new URLSearchParams(searchParams);
                if (val.trim()) {
                  newParams.set('search', val);
                } else {
                  newParams.delete('search');
                }
                setSearchParams(newParams);
              }}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="glass-card p-4 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
              <h5 className="fw-bold font-heading mb-0"><i className="bi bi-funnel-fill text-primary me-2"></i>Filters</h5>
              <button 
                onClick={handleResetFilters}
                className="btn btn-sm text-primary p-0 font-heading fw-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Department Categories Filter */}
            <div className="mb-4">
              <label className="form-label font-heading fw-bold small text-muted text-uppercase mb-2">Departments</label>
              <div className="d-flex flex-column gap-1">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`btn btn-sm text-start font-heading border-0 py-2 px-3 rounded-3 d-flex justify-content-between align-items-center ${
                    selectedCategory === 'all' ? 'btn-megavault' : 'text-main hover-bg'
                  }`}
                >
                  <span>All Departments</span>
                  <span className="badge bg-secondary rounded-pill">{allProductsData.length}</span>
                </button>
                {categoriesData.map((cat) => {
                  const count = allProductsData.filter(p => isCategoryMatch(p, cat.id)).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`btn btn-sm text-start font-heading border-0 py-2 px-3 rounded-3 d-flex justify-content-between align-items-center ${
                        selectedCategory === cat.id ? 'btn-megavault' : 'text-main hover-bg'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="badge bg-secondary rounded-pill">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Cap Slider */}
            <div className="mb-4 pt-3 border-top border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label font-heading fw-bold small text-muted text-uppercase mb-0">MAX PRICE CAP</label>
                <span className="fw-bold text-primary font-heading fs-6">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                className="form-range custom-range"
                min="999"
                max="100000"
                step="500"
                value={priceRange}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted font-monospace mt-1" style={{ fontSize: '0.72rem' }}>
                <span>₹999</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-3 pt-3 border-top border-secondary">
              <label className="form-label font-heading fw-bold small text-muted text-uppercase mb-2">Rating</label>
              <select className="form-select glass-card border-secondary text-main" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value="0">All Ratings</option>
                <option value="4.5">⭐ 4.5 &amp; Above</option>
                <option value="4.7">⭐ 4.7 &amp; Above</option>
                <option value="4.9">⭐ 4.9 Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-lg-9">
          {/* Active Filters Bar */}
          {(selectedCategory !== 'all' || selectedBudget !== 'all' || priceRange < 100000 || searchQuery.trim()) && (
            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
              <small className="text-muted font-heading fw-bold">Active Filters:</small>
              {selectedCategory !== 'all' && (
                <span className="badge bg-primary font-heading px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5">
                  Dept: {categoriesData.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <i className="bi bi-x-circle-fill ms-1 cursor-pointer" onClick={() => handleCategoryClick('all')}></i>
                </span>
              )}
              {selectedBudget !== 'all' && (
                <span className="badge bg-warning text-dark font-heading px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5">
                  Budget Segment: {selectedBudget === 'under-10k' ? 'Under ₹10,000' : selectedBudget === 'under-30k' ? 'Under ₹30,000' : selectedBudget === 'under-50k' ? 'Under ₹50,000' : 'Under ₹1 Lakh'}
                  <i className="bi bi-x-circle-fill ms-1 cursor-pointer" onClick={() => {
                    setSelectedBudget('all');
                    setPriceRange(100000);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('budget');
                    setSearchParams(newParams);
                  }}></i>
                </span>
              )}
              {priceRange < 100000 && selectedBudget === 'all' && (
                <span className="badge bg-info text-dark font-heading px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5">
                  Max Cap: ₹{priceRange.toLocaleString('en-IN')}
                  <i className="bi bi-x-circle-fill ms-1 cursor-pointer" onClick={() => setPriceRange(100000)}></i>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="badge bg-secondary font-heading px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5">
                  Search: "{searchQuery}"
                  <i className="bi bi-x-circle-fill ms-1 cursor-pointer" onClick={() => setSearchQuery('')}></i>
                </span>
              )}
            </div>
          )}

          {/* Sorting Bar */}
          <div className="glass-card p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="text-muted small font-heading">
              Showing <strong className="text-main">{filteredProducts.length}</strong> of {productsList.length} products (Priced $\le$ ₹{priceRange.toLocaleString('en-IN')})
            </span>

            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted font-heading text-nowrap">Sort By:</label>
              <select 
                className="form-select form-select-sm glass-card border-secondary text-main font-heading" 
                style={{ width: '160px' }}
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

          {/* Product Cards Grid */}
          {isLoading ? (
            <div className="glass-card p-5 text-center my-4">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <h5 className="fw-bold font-heading">Loading Products...</h5>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-card p-5 text-center my-4">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <h4 className="fw-bold font-heading">No Products Found</h4>
              <p className="text-muted">No products found priced under ₹{priceRange.toLocaleString('en-IN')}. Try increasing the price slider or resetting filters.</p>
              <button onClick={handleResetFilters} className="btn btn-megavault btn-sm mt-2 font-heading">Reset All Filters</button>
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
