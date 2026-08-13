import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./index.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("megavault_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("megavault_user");
    localStorage.removeItem("megavault_token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleStartEdit = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setIsEditing(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (editName.trim() && editEmail.trim()) {
      const updatedUser = { name: editName.trim(), email: editEmail.trim() };
      setUser(updatedUser);
      localStorage.setItem("megavault_user", JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success("Profile updated successfully!", { icon: "✅" });
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="glass-card p-5 mx-auto text-center border-primary shadow-lg" style={{ maxWidth: "560px" }}>
          <div className="bg-primary text-white rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: "64px", height: "64px" }}>
            <i className="bi bi-person-lock fs-2"></i>
          </div>

          <h3 className="fw-bold font-heading mb-2">Sign In to View Profile</h3>
          <p className="text-muted mb-4 leading-relaxed">
            You are currently visiting as a Guest. Please sign in to your MegaVault account to view your orders, track shipments, and manage your account details.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/login" className="btn btn-megavault btn-lg font-heading px-4 py-2.5">
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In Now
            </Link>
            <Link to="/register" className="btn btn-megavault-outline btn-lg font-heading px-4 py-2.5">
              <i className="bi bi-person-plus me-2"></i>Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userName = user.name || "Sai Tej";
  const userEmail = user.email || "sai9840tej@gmail.com";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="container py-4">
      <div className="glass-card p-4 p-md-5 border-primary mb-4 shadow-lg position-relative overflow-hidden">
        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold font-heading text-white shadow-lg flex-shrink-0"
            style={{ 
              width: "80px", 
              height: "80px", 
              fontSize: "1.8rem",
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" 
            }}
          >
            {userInitials}
          </div>

          <div className="text-center text-md-start flex-grow-1">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <h3 className="fw-bold font-heading mb-0 text-main">{userName}</h3>
              <span className="badge badge-megavault px-2.5 py-1">Customer</span>
              <button 
                onClick={handleStartEdit} 
                className="btn btn-outline-primary btn-sm rounded-pill font-heading px-3 ms-md-2 d-inline-flex align-items-center gap-1"
                title="Edit your name & email"
              >
                <i className="bi bi-pencil-square"></i>
                <span>Edit Profile</span>
              </button>
            </div>
            <p className="text-muted small mb-0">
              {userEmail} • Member since {new Date().getFullYear()}
            </p>
          </div>

          <div>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm font-heading px-3 py-2 d-flex align-items-center gap-1.5">
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="glass-card p-3 mb-4">
            <h6 className="fw-bold font-heading mb-3 px-2">Account Settings</h6>
            <div className="list-group list-group-flush">
              <a href="#orders" className="list-group-item list-group-item-action glass-card active border-0 text-white rounded-3 mb-2 font-heading d-flex align-items-center gap-2 py-2.5">
                <i className="bi bi-box-seam text-primary"></i>My Order History
              </a>
              <button 
                onClick={handleStartEdit} 
                className="list-group-item list-group-item-action text-main border-0 rounded-3 font-heading d-flex align-items-center gap-2 py-2.5 hover-bg w-100 text-start bg-transparent"
              >
                <i className="bi bi-person-gear text-primary"></i>Edit Profile Name & Email
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="glass-card p-4">
            <h5 className="fw-bold font-heading mb-4 border-bottom border-secondary pb-3">
              <i className="bi bi-clock-history text-primary me-2"></i>Recent Orders (INR ₹)
            </h5>

            <div className="d-flex flex-column gap-3">
              <div className="glass-card p-3.5 border-secondary text-center py-4">
                <i className="bi bi-bag-check fs-2 text-primary mb-2 d-block"></i>
                <h6 className="fw-bold font-heading text-main">Your Placed Orders Will Appear Here</h6>
                <p className="text-muted small mb-3">You haven't placed any orders yet.</p>
                <Link to="/products" className="btn btn-megavault btn-sm font-heading px-4">Browse Products</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-primary p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                <h5 className="fw-bold font-heading mb-0">
                  <i className="bi bi-pencil-square text-primary me-2"></i>Edit Profile Info
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>

              <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-semibold text-main">Full Name</label>
                  <input
                    type="text"
                    className="form-control glass-card text-main"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label small fw-semibold text-main">Email Address</label>
                  <input
                    type="email"
                    className="form-control glass-card text-main"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end mt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm font-heading">Cancel</button>
                  <button type="submit" className="btn btn-megavault btn-sm font-heading px-4">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
