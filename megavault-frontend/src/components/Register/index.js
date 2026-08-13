import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./index.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userObj = {
      name: formData.name,
      email: formData.email
    };

    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem("megavault_user", JSON.stringify(userObj));
      localStorage.setItem("megavault_token", "mock_jwt_token_12345");
      toast.success("Account created successfully!", { icon: "🎉" });
      navigate("/");
    }, 600);
  };

  return (
    <div className="container py-5">
      <div className="glass-card p-4 p-md-5 mx-auto border-primary shadow-lg" style={{ maxWidth: "440px" }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: "56px", height: "56px" }}>
            <i className="bi bi-person-plus fs-3"></i>
          </div>
          <h3 className="fw-bold font-heading mb-1">Create Account</h3>
          <p className="text-muted small mb-0">Join MegaVault for personalized AI deals & instant checkout.</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-semibold text-main">Full Name</label>
            <input
              type="text"
              className="form-control glass-card border-secondary text-main"
              placeholder="e.g. Sai Tej"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-main">Email Address</label>
            <input
              type="email"
              className="form-control glass-card border-secondary text-main"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-main">Password</label>
            <input
              type="password"
              className="form-control glass-card border-secondary text-main"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-megavault btn-lg w-100 font-heading mt-2"
          >
            {isSubmitting ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary small text-muted">
          Already registered?{" "}
          <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
