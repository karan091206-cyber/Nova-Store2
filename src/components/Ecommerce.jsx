import React, { useState, useEffect } from 'react';

/**
 * Ecommerce Component
 * 
 * Responsibilities:
 * 1. Fetches product data from FakeStore API (https://fakestoreapi.com/products) on mount using useEffect().
 * 2. Normalizes product objects (title, price, image, rating, category, description).
 * 3. Stores products, loading, and error states using useState().
 * 4. Provides live search (by product name) and category filtering using filter().
 * 5. Displays products in a responsive grid layout using map().
 * 6. Passes chosen products to the parent App component via onAddToCart prop.
 */
function Ecommerce({ onAddToCart, cart }) {
  // State 1: Store products fetched from the API
  const [products, setProducts] = useState([]);

  // State 2: Track loading status while the API request is in progress
  const [loading, setLoading] = useState(true);

  // State 3: Store error message if the API request fails
  const [error, setError] = useState(null);

  // State 4: Store the current search text typed into the search bar
  const [searchTerm, setSearchTerm] = useState('');

  // State 5: Store the currently selected category filter ('all' by default)
  const [selectedCategory, setSelectedCategory] = useState('all');

  // State 6: Track the ID of the product just added to cart (for quick visual feedback)
  const [justAddedId, setJustAddedId] = useState(null);

  /**
   * Function to fetch products from the FakeStore API.
   * If FakeStore API fails or is slow, it also includes a fallback mechanism.
   */
  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    // Using fetch() to get products data from FakeStore API
    fetch('https://fakestoreapi.com/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // Normalize product schema to handle FakeStoreAPI items smoothly
        const rawList = Array.isArray(data) ? data : data.products || [];
        const normalizedProducts = rawList.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: Number(item.price) || 0,
          category: item.category || 'general',
          image: item.image || item.thumbnail || '',
          rating: typeof item.rating === 'object' ? item.rating?.rate || 4.5 : Number(item.rating) || 4.5,
          reviewsCount: typeof item.rating === 'object' ? item.rating?.count || 48 : 50,
        }));

        setProducts(normalizedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while fetching products.');
        setLoading(false);
      });
  };

  /**
   * useEffect() Hook:
   * The empty dependency array [] ensures this effect runs ONLY once
   * when the Ecommerce component first mounts (loads onto the screen).
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Handle adding a product to cart and show brief "Added!" feedback.
   */
  const handleAddToCartClick = (product) => {
    onAddToCart(product);

    // Provide visual feedback for 1.2 seconds on the clicked card
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  /**
   * Extract unique categories from products using map() and new Set().
   */
  const uniqueCategories = [
    'all',
    ...new Set(products.map((product) => product.category)),
  ];

  /**
   * Filter products based on search term and selected category.
   * Uses JavaScript filter() array method.
   */
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * Helper function to check how many units of a product are already in cart
   */
  const getProductQuantityInCart = (productId) => {
    if (!cart) return 0;
    const foundItem = cart.find((item) => item.id === productId);
    return foundItem ? foundItem.quantity : 0;
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p className="status-text">Fetching live catalog from FakeStore API...</p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="status-container error-state">
        <div className="error-icon">⚠️</div>
        <h3>Oops! Failed to load products</h3>
        <p>{error}</p>
        <button className="primary-btn retry-btn" onClick={fetchProducts}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  // 3. Normal Product Catalog Display
  return (
    <div className="ecommerce-container">
      {/* Hero / Banner Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">✨ NovaStore Official Collection</span>
          <h1 className="hero-title">Curated Essentials for Modern Living</h1>
          <p className="hero-subtitle">
            Explore authentic fashion, jewelry, and cutting-edge electronics sourced worldwide with lightning-fast delivery.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section className="controls-section">
        {/* Search Bar (Uses onChange to update searchTerm) */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search products by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <div className="category-filter-wrapper">
          <label htmlFor="category-select" className="filter-label">
            Category:
          </label>
          <select
            id="category-select"
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all'
                  ? 'All Categories'
                  : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Category Pills (Quick clickable filter buttons) */}
      <div className="category-pills">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all'
              ? 'All'
              : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Results Count Bar */}
      <div className="results-bar">
        <p className="results-count">
          Showing <strong>{filteredProducts.length}</strong> of{' '}
          <strong>{products.length}</strong> products
          {selectedCategory !== 'all' && (
            <span> in <em>"{selectedCategory}"</em></span>
          )}
          {searchTerm && (
            <span> matching <em>"{searchTerm}"</em></span>
          )}
        </p>
        {(searchTerm || selectedCategory !== 'all') && (
          <button
            className="reset-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Reset Filters ✕
          </button>
        )}
      </div>

      {/* No Products Found Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="no-products-box">
          <div className="no-products-icon">🔎</div>
          <h3>No products match your search</h3>
          <p>Try searching with another keyword or resetting the category filter.</p>
          <button
            className="primary-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        /* Products Grid (Uses map() to render each product card) */
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const quantityInCart = getProductQuantityInCart(product.id);
            const isJustAdded = justAddedId === product.id;

            return (
              <div key={product.id} className="product-card">
                {/* Product Image Container */}
                <div className="card-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    loading="lazy"
                  />
                  <span className="category-badge">
                    {product.category.replace('-', ' ')}
                  </span>
                  {quantityInCart > 0 && (
                    <span className="in-cart-badge">
                      In Cart: {quantityInCart}
                    </span>
                  )}
                </div>

                {/* Product Information */}
                <div className="card-body">
                  <div className="card-rating">
                    <span className="star-icon">★</span>
                    <span className="rating-value">{Number(product.rating).toFixed(1)}</span>
                    <span className="rating-reviews">({product.reviewsCount} reviews)</span>
                  </div>

                  <h3 className="product-title" title={product.title}>
                    {product.title}
                  </h3>

                  <p className="product-description" title={product.description}>
                    {product.description}
                  </p>

                  <div className="card-footer">
                    <div className="price-tag">
                      <span className="currency">$</span>
                      <span className="amount">{Number(product.price).toFixed(2)}</span>
                    </div>

                    {/* Add To Cart Button */}
                    <button
                      className={`add-to-cart-btn ${isJustAdded ? 'just-added' : ''}`}
                      onClick={() => handleAddToCartClick(product)}
                      disabled={isJustAdded}
                    >
                      {isJustAdded ? (
                        <>
                          <span>✓</span> Added!
                        </>
                      ) : (
                        <>
                          <span>⚡</span> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Ecommerce;
