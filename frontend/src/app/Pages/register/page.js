"use client";

import React, { useState } from 'react';
import './signup.css';
import OtpComponent from '@/app/Component/OtpComponent/page';
import { postData } from '@/app/services/FetchNodeServices';
import { ToastContainer, toast } from 'react-toastify';

const Page = () => {
  const [otpForm, setOtpForm] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '', });

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Basic validation before submission
  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: '', email: '', mobile: '', password: '', confirmPassword: '' };

    if (!formData.fullName) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Payload to be sent

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      };
      const response = await postData(`api/users/send-otp-for-user-signup`, payload)
      if (response.success === true) {
        toast.success(response?.message);
        setOtpForm(true)
      }
    }
  };

  return (<>
    <ToastContainer />
    {otpForm != true ?
      < section className="signup-section">
        <div className="container">
          <h2 className="signup-title">Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="row">
              {/* Full Name Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="fullName">Enter Your Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="error-message">{errors.fullName}</p>}
              </div>

              {/* Email Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="email">Enter Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              {/* Mobile Number Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="mobile">Enter Your Mobile Number</label>
                <input
                  type="text"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your mobile number"
                />
                {errors.mobile && <p className="error-message">{errors.mobile}</p>}
              </div>

              {/* Password Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="password">Create a Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Create your password"
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="confirmPassword">Confirm Your Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>

              {/* Signup Button */}
              <div className="col-md-12 buttons-container">
                <button type="submit" className="signup-button">
                  Sign Up
                </button>
              </div>

              {/* Social Signup */}
              {/* <div className="col-md-12 social-signup">
                <p>Or Sign Up With</p>
                <div className="social-buttons">
                  <button type="button" className="google-button">
                    <i className="bi bi-google"></i> Google
                  </button>
                  <button type="button" className="facebook-button">
                    <i className="bi bi-facebook"></i> Facebook
                  </button>
                </div>
              </div> */}
            </div>
          </form>
        </div>
      </section > :
      <OtpComponent formData={formData} handleSubmit={handleSubmit} setOtpForm={setOtpForm} title='user' />
    }
  </>

  );
};

export default Page;
