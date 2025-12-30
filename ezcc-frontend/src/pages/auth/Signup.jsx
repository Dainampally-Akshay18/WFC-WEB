import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Construct the payload exactly as the UserRegister schema requires
    const signupPayload = {
      email: formData.email.trim(),
      password: formData.password,
      full_name: formData.full_name.trim(),
      branch_id: "f4f8034f-94e8-4e3d-8961-f6a636f5f494" // Ensure no trailing spaces
    };

    console.log("Submitting to /auth/signup:", signupPayload);

    const result = await signup(signupPayload);
    
    if (result.success) {
      toast.success('Account created! Please login.');
      navigate('/login');
    } else {
      // If result.error exists, it will show you the exact Pydantic validation failure
      console.error("Validation Error Details:", result.error);
      toast.error(result.error || "Registration failed. Check console for details.");
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Member Account</h2>
        <p className="auth-subtitle">Join the WFC Portal</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;