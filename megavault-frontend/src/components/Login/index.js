import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailPrefix = email.split("@")[0] || "User";
    const formattedName = emailPrefix
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const userObj = {
      name: formattedName,
      email: email
    };

    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem("megavault_user", JSON.stringify(userObj));
      localStorage.setItem("megavault_token", "mock_jwt_token_12345");
      toast.success(`Welcome back, ${userObj.name}!`, { icon: "👋" });
      navigate("/");
    }, 600);
  };

  return (
    <div className="container py-5">
      <div className="glass-card p-4 p-md-5 mx-auto border-primary shadow-lg" style={{ maxWidth: "440px" }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: "56px", height: "56px" }}>
            <i className="bi bi-box-arrow-in-right fs-3"></i>
          </div>
          <h3 className="fw-bold font-heading mb-1">Welcome Back</h3>
          <p className="text-muted small mb-0">Sign in to access your saved wishlist, orders, and AI profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-semibold text-main">Email Address</label>
            <div className="input-group">
              <span className="input-group-text glass-card border-end-0 border-secondary text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control glass-card border-start-0 border-secondary text-main"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold text-main mb-0">Password</label>
              <a href="#forgot" className="small text-primary text-decoration-none">Forgot?</a>
            </div>
            <div className="input-group">
              <span className="input-group-text glass-card border-end-0 border-secondary text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control glass-card border-start-0 border-secondary text-main"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-megavault btn-lg w-100 font-heading mt-2"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary small text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary fw-bold text-decoration-none ms-1">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
