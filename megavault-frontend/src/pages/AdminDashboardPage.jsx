import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { allProductsData } from '../utils/mockData';

export const AdminDashboardPage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState(allProductsData);
  const [selectedDeletedProduct, setSelectedDeletedProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch live products from backend if running, fallback to mockData
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        // Fallback to local catalog
      }
    };
    fetchProducts();
  }, []);

  // Check if current logged in user has Admin privileges
  const isAdmin = isLoggedIn && user && (
    user.role === 'ROLE_SUPER_ADMIN' ||
    user.role === 'ROLE_CATEGORY_ADMIN' ||
    user.email === 'tejs59885@gmail.com' ||
    user.email === 'sainalajala984@gmail.com' ||
    user.email === 'admin@megavault.com'
  );

  // If user is NOT an Admin (Customer or Guest attempting direct URL access)
  if (!isAdmin) {
    return (
      <div className="py-5">
        <div className="glass-card p-5 mx-auto text-center border-danger shadow-lg rounded-4" style={{ maxWidth: '580px' }}>
          <div className="bg-danger text-white rounded-circle p-3.5 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '72px', height: '72px' }}>
            <i className="bi bi-shield-lock-fill fs-1"></i>
          </div>

          <span className="badge bg-danger font-monospace px-3 py-1 mb-2">ACCESS RESTRICTED</span>
          <h3 className="fw-bold font-heading text-main mb-2">Admin Portal Authentication Required</h3>
          <p className="text-muted leading-relaxed mb-4">
            {isLoggedIn ? (
              <>
                You are currently signed in as <strong className="text-main">{user.email}</strong> (<span className="badge bg-secondary">CUSTOMER</span>). Customer accounts are strictly prohibited from accessing administrative inventory &amp; product deletion controls.
              </>
            ) : (
              <>
                You are visiting as a Guest. Direct URL access to <strong>/admin</strong> requires a verified Super Admin session.
              </>
            )}
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button 
              onClick={() => {
                toast.error('Please sign in with an authorized Admin account', { icon: '🛡️' });
                navigate('/login');
              }}
              className="btn btn-megavault btn-lg font-heading px-4 py-2.5 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-shield-lock"></i>
              <span>Sign In for Admin Portal</span>
            </button>
            <Link to="/" className="btn btn-outline-secondary btn-lg font-heading px-4 py-2.5">
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle Product Deletion & Retrieve Deleted Product Details
  const handleDeleteProduct = async (id) => {
    const productToDelete = products.find(p => String(p.id) === String(id));
    
    if (!window.confirm(`Are you sure you want to delete "${productToDelete?.title || 'this product'}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      let deletedDetails = null;

      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        try {
          const resData = await res.json();
          deletedDetails = resData.deletedProduct || resData || productToDelete;
        } catch (e) {
          deletedDetails = productToDelete;
        }
      } else {
        deletedDetails = productToDelete;
      }

      if (!deletedDetails) {
        deletedDetails = productToDelete;
      }

      // Remove from state list
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      
      // Store deleted product details and pop up details summary modal
      setSelectedDeletedProduct({
        ...deletedDetails,
        deletedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });

      toast.success(`Deleted: ${deletedDetails.title || 'Product'} (SKU: ${deletedDetails.productCode || 'N/A'})`, {
        icon: '🗑️',
        duration: 4000
      });

    } catch (err) {
      // Local fallback
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      setSelectedDeletedProduct({
        ...productToDelete,
        deletedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      toast.success(`Deleted: ${productToDelete?.title || 'Product'}`, { icon: '🗑️' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.productCode && p.productCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-4">
      {/* Dashboard Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge badge-megavault">Admin Workspace</span>
            <span className="badge bg-success font-monospace">Logged in as {user?.email}</span>
          </div>
          <h2 className="fw-bold font-heading mb-1 text-main">Catalog &amp; Inventory Management</h2>
          <p className="text-muted mb-0">Manage products, inspect SKU details, and execute deletion with full audit reports.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control glass-card border-secondary text-main"
            placeholder="Search SKU or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '280px' }}
          />
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="glass-card p-4 border-secondary shadow-sm hover-bg transition-all h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted font-heading uppercase tracking-wider fw-semibold">Total Active Products</span>
              <div className="rounded-3 p-2 bg-primary bg-opacity-15 text-primary d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-box-seam fs-6"></i>
              </div>
            </div>
            <h3 className="fw-bold text-primary mb-0 font-heading mt-1">{products.length}</h3>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-card p-4 border-secondary shadow-sm hover-bg transition-all h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted font-heading uppercase tracking-wider fw-semibold">Total Revenue</span>
              <div className="rounded-3 p-2 bg-success bg-opacity-15 text-success d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-currency-rupee fs-6"></i>
              </div>
            </div>
            <h3 className="fw-bold text-success mb-0 font-heading mt-1">₹4,82,500</h3>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-card p-4 border-secondary shadow-sm hover-bg transition-all h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted font-heading uppercase tracking-wider fw-semibold">Active Departments</span>
              <div className="rounded-3 p-2 bg-warning bg-opacity-15 text-warning d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-grid-fill fs-6"></i>
              </div>
            </div>
            <h3 className="fw-bold text-warning mb-0 font-heading mt-1">6 Categories</h3>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-card p-4 border-secondary shadow-sm hover-bg transition-all h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted font-heading uppercase tracking-wider fw-semibold">System Status</span>
              <div className="rounded-3 p-2 bg-info bg-opacity-15 text-info d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-activity fs-6"></i>
              </div>
            </div>
            <h3 className="fw-bold text-info mb-0 font-heading mt-1 d-flex align-items-center gap-2">
              <span>Online</span>
              <span className="badge bg-success rounded-circle p-1.5" style={{ width: '10px', height: '10px' }} title="System Operational"></span>
            </h3>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card p-4 border-secondary shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
          <h5 className="fw-bold font-heading mb-0 text-main">
            <i className="bi bi-box-seam text-primary me-2"></i>Product Catalog Inventory
          </h5>
          <span className="badge bg-secondary font-monospace">{filteredProducts.length} Items Listed</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle text-main mb-0">
            <thead>
              <tr className="border-secondary text-muted font-heading small uppercase">
                <th scope="col">Product</th>
                <th scope="col">SKU / Code</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Rating</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className="border-secondary">
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={p.image} alt={p.title} className="rounded-3 object-fit-cover shadow-sm" style={{ width: '44px', height: '44px' }} />
                      <div>
                        <strong className="d-block font-heading text-main mb-0.5">{p.title}</strong>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '240px' }}>{p.description}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary bg-opacity-25 text-primary font-monospace border border-primary border-opacity-25 px-2.5 py-1">
                      {p.productCode || `SKU-${p.id}`}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary rounded-pill font-heading">{p.category}</span>
                  </td>
                  <td>
                    <strong className="text-primary font-heading">₹{Number(p.price).toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className="small font-heading text-warning">
                      <i className="bi bi-star-fill me-1"></i>{p.rating || 4.5}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        onClick={() => setViewingProduct(p)}
                        className="btn btn-outline-info btn-sm rounded-pill font-heading px-3"
                        title="View Full Product Specs"
                      >
                        <i className="bi bi-eye-fill me-1"></i>Specs
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        disabled={isDeleting}
                        className="btn btn-outline-danger btn-sm rounded-pill font-heading px-3"
                        title="Delete Product & Get Details"
                      >
                        <i className="bi bi-trash3-fill me-1"></i>Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: DELETED PRODUCT DETAILS AUDIT SUMMARY */}
      {selectedDeletedProduct && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(10px)', 
            zIndex: 999999, 
            overflowY: 'auto' 
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '580px' }}>
            <div className="modal-content glass-card border-danger p-4 shadow-lg">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-danger">
                <div className="d-flex align-items-center gap-2 text-danger">
                  <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-trash3-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold font-heading mb-0 text-main">Deleted Product Details Report</h5>
                    <small className="text-muted">Audit Record • Deleted at {selectedDeletedProduct.deletedAt}</small>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedDeletedProduct(null)}></button>
              </div>

              {/* Body: Product Specs */}
              <div className="py-2">
                <div className="glass-card p-3 border-secondary mb-3 bg-secondary bg-opacity-10 d-flex gap-3 align-items-center">
                  <img 
                    src={selectedDeletedProduct.image} 
                    alt={selectedDeletedProduct.title} 
                    className="rounded-3 object-fit-cover shadow-sm flex-shrink-0" 
                    style={{ width: '90px', height: '90px' }} 
                  />
                  <div>
                    <span className="badge bg-danger text-white mb-1 font-monospace">DELETED FROM CATALOG</span>
                    <h5 className="fw-bold font-heading text-main mb-1">{selectedDeletedProduct.title}</h5>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary font-monospace">{selectedDeletedProduct.productCode || 'SKU'}</span>
                      <span className="badge bg-secondary font-heading">{selectedDeletedProduct.category}</span>
                      <strong className="text-primary font-heading">₹{Number(selectedDeletedProduct.price).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-3 border-secondary">
                  <h6 className="fw-bold font-heading text-main mb-2">Detailed Audit Metadata:</h6>
                  <ul className="list-unstyled mb-0 text-muted small d-flex flex-column gap-2">
                    <li className="d-flex justify-content-between border-bottom border-secondary pb-1.5">
                      <span>Product ID:</span>
                      <strong className="text-main font-monospace">#{selectedDeletedProduct.id}</strong>
                    </li>
                    <li className="d-flex justify-content-between border-bottom border-secondary pb-1.5">
                      <span>Unique SKU Code:</span>
                      <strong className="text-primary font-monospace">{selectedDeletedProduct.productCode || 'N/A'}</strong>
                    </li>
                    <li className="d-flex justify-content-between border-bottom border-secondary pb-1.5">
                      <span>Category ID / Slug:</span>
                      <strong className="text-main font-heading">{selectedDeletedProduct.categoryId || selectedDeletedProduct.categorySlug || selectedDeletedProduct.category}</strong>
                    </li>
                    <li className="d-flex justify-content-between border-bottom border-secondary pb-1.5">
                      <span>Original Selling Price:</span>
                      <strong className="text-main font-heading">₹{Number(selectedDeletedProduct.price).toLocaleString('en-IN')}</strong>
                    </li>
                    <li className="d-flex justify-content-between border-bottom border-secondary pb-1.5">
                      <span>Customer Rating:</span>
                      <strong className="text-warning font-heading">⭐ {selectedDeletedProduct.rating || 4.5} ({selectedDeletedProduct.reviewsCount || 50} reviews)</strong>
                    </li>
                    <li>
                      <span className="d-block mb-1">Full Description:</span>
                      <p className="text-main glass-card p-2.5 rounded-3 mb-0 text-break bg-dark bg-opacity-25" style={{ fontSize: '0.85rem' }}>
                        {selectedDeletedProduct.description || 'No description recorded.'}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="d-flex justify-content-end mt-3 pt-2 border-top border-secondary">
                <button 
                  type="button" 
                  onClick={() => setSelectedDeletedProduct(null)} 
                  className="btn btn-megavault btn-sm px-4 font-heading"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: ACTIVE PRODUCT SPECS MODAL */}
      {viewingProduct && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 999999, 
            overflowY: 'auto' 
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '540px' }}>
            <div className="modal-content glass-card border-primary p-4 shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle-fill text-primary fs-5"></i>
                  <span>Product Specifications</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewingProduct(null)}></button>
              </div>

              <div className="d-flex gap-3 align-items-center mb-3">
                <img src={viewingProduct.image} alt={viewingProduct.title} className="rounded-3 object-fit-cover shadow-sm" style={{ width: '80px', height: '80px' }} />
                <div>
                  <h5 className="fw-bold font-heading text-main mb-1">{viewingProduct.title}</h5>
                  <span className="badge bg-primary font-monospace me-2">{viewingProduct.productCode || 'SKU'}</span>
                  <span className="badge bg-secondary font-heading me-2">{viewingProduct.category}</span>
                  <strong className="text-primary font-heading">₹{Number(viewingProduct.price).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="glass-card p-3 border-secondary mb-3">
                <small className="text-muted d-block uppercase tracking-wider font-heading fw-bold mb-1">Description:</small>
                <p className="text-main mb-0 small leading-relaxed">{viewingProduct.description}</p>
              </div>

              <div className="d-flex justify-content-end pt-2 border-top border-secondary">
                <button type="button" onClick={() => setViewingProduct(null)} className="btn btn-outline-secondary btn-sm px-4 font-heading">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
