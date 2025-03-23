"use client";

import React, { useState } from "react";
import "./newslater.css";
import { postData } from "@/app/services/FetchNodeServices";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  // State to store form input values
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs (basic validation)
    if (!email || !phone || !name) {
      setError("All fields are required");
      return;
    }
    // Prepare the payload
    const payload = { email, phone, name }

    try {

      const response = await postData("api/newsletter/create-newsletter", payload);

      console.log("response", response)

      if (response.success === true) {
        // Handle success
        alert("Subscription successful!");
        setEmail(""); // Reset form fields
        setPhone("");
        setName("");
        // setError("");
        setError("Subscription successful!");
      } else {
        // alert("This email is already subscribed!");
        setError("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="newslater">
        <div className="container">
          <div className="newslater-form">
            <h2>MANOVAIDYA</h2>
            <p>
              Sign up to our newsletter - the place for wild news, invitations
              and good karma treats!
            </p>
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <div className="newslater-input-field">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update state on input change
                />
              </div>

              {/* Mobile number input */}
              <div className="newslater-input-field">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Name input */}
              <div className="newslater-input-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Error message */}
              {error && <p className="error-text">{error}</p>}

              {/* Submit button */}
              <div className="text-center">
                <button type="submit" className="signup-btn">
                  SIGN UP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
