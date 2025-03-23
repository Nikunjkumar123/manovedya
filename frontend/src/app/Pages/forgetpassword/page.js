"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./forgot-password.css";
import { postData } from "@/app/services/FetchNodeServices";

const Page = () => {
  const router = useRouter(); // Correct usage of the Next.js Router hook
  const [showOtpField, setShowOtpField] = useState(false); // State to toggle OTP field
  const [email, setEmail] = useState(""); // State for email/mobile input
  const [otp, setOtp] = useState(["", "", "", ""]); // State for OTP (4-digit array)

  // Handle "Send OTP" button click
  const handleSendOtp = async (e) => {
    // e.preventDefault();
    // if (email.trim() === "") {
    //   alert("Please enter your email or mobile number!");
    //   return;
    // }
    // setShowOtpField(true); // Show OTP fields
    // console.log("OTP sent to:", email); // Mock OTP sending
    const response = await postData(`api/users/send-reset-password-email`, {email})
    console.log("response", response)

  };

  // Handle OTP digit change
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus the next input field
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Handle "Verify OTP" button click
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      alert("Please enter the complete OTP!");

      return;
    }
    console.log("OTP verified:", otp.join("")); // Mock OTP verification
    alert("OTP Verified Successfully!");
    router.push("/Pages/Login");
  };

  return (
    <section className="forgot-password-section">
      <div className="container">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="forgot-password-description">
          Enter your registered email or mobile number, and we’ll send you a
          reset link or OTP.
        </p>
        <form className="forgot-password-form">
          <div className="row">
            {!showOtpField ? (
              <>
                {/* Email / Mobile Input */}
                <div className="col-md-12 form-group">
                  <label htmlFor="email">Enter Your Email / Mobile No.</label>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email / mobile no."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Send OTP Button */}
                <div className="col-md-12 buttons-container">
                  <button
                    type="button"
                    className="send-reset-button"
                    onClick={handleSendOtp}
                  >
                    Send Reset Link / OTP
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* OTP Input Fields */}
                <div className="col-md-12 form-group otp-container">
                  <label>Enter OTP</label>
                  <div className="otp-inputs">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        className="otp-input"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify OTP Button */}
                <div className="col-md-12 buttons-container">
                  <button
                    type="button"
                    className="send-reset-button"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}

            {/* Back to Login Link */}
            <div className="col-md-12 back-to-login">
              <p>
                Remembered your password?{" "}
                <a href="/Pages/login" className="login-link">
                  Back to Login
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;
