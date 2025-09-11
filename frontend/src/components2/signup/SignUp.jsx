import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, Eye, EyeOff, CheckCircle } from 'lucide-react';
import './SignUpfile.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'team-lead',
    department: '',
    employeeId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { value: 'team-lead', label: 'Team Lead', description: 'Manage field projects and team attendance' },
    { value: 'admin', label: 'Administrator', description: 'Full system access and user management' }
  ];

  const departments = [
    'Operations',
    'Engineering',
    'Safety',
    'Finance',
    'Human Resources',
    'Management'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'team-lead' && !formData.department) {
      newErrors.department = 'Department is required for Team Leads';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      
      // Show success message and redirect
      alert('Account created successfully! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="signup-content">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="employeeId">
                  <User size={16} />
                  Employee ID *
                </label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="e.g., EMP001"
                  className={errors.employeeId ? 'error' : ''}
                />
                {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="department">
                  <Building size={16} />
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? 'error' : ''}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  Password *
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={errors.password ? 'error' : ''}
                  />
                  {/* <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button> */}
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={16} />
                  Confirm Password *
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {/* <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="password-toggle2"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button> */}
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="role-selection">
              <label>Select Role *</label>
              <div className="role-options">
                {roles.map(role => (
                  <div
                    key={role.value}
                    className={`role-card ${formData.role === role.value ? 'selected' : ''}`}
                    onClick={() => handleChange({
                      target: { name: 'role', value: role.value }
                    })}
                  >
                    <div className="role-checkbox">
                      {formData.role === role.value && <CheckCircle size={16} />}
                    </div>
                    <div className="role-content">
                      <h4>{role.label}</h4>
                      <p>{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading-spinner"></div>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/signin">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;