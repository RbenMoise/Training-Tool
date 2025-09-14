import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  AlertCircle,
} from "lucide-react";
import "./SignIn.css";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError("");

    try {
      // Call backend API
      const response = await axios.post("/att/auth/login", formData, {
        withCredentials: true,
      });

      console.log("Login successful:", response.data);

      // Save token or user info in localStorage
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("authToken", response.data.token);
      }

      navigate("/homeAttendance"); // redirect after login
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  //   const togglePasswordVisibility = () => {
  //     setShowPassword(!showPassword);
  //   };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    navigate("/forgot-password");
  };

  // Pre-fill email if remember me was checked previously
  React.useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("userEmail");

    if (remembered === "true" && savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  return (
    <div className="signin-container">
      <div className="signin-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="signin-content">
        <div className="signin-card">
          <div className="signin-header">
            <h1>Welcome Back</h1>
          </div>

          {loginError && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "error" : ""}
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                  autoComplete="current-password"
                />
                {/* <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button> */}
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="signin-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading-spinner"></div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="signup-link">
              Don't have an account? <Link to="/signup">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
