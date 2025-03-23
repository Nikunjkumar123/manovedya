"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./slider.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import Image from "next/image";

const Page = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getData("api/banners");
        console.log("Response:", response?.banners);

        // Check if response is successful and has banners
        if (response?.success === true && response?.banners) {
          setBanners(response?.banners);
        } else {
          setError("No banners found or error in API response.");
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banner images.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="10000"
    >
      <div className="carousel-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={`${serverURL}/uploads/banners/${banner?.images[0]}`}
              className="desktop-banner"
              height={500}
              width={1200}
              alt={`slide-${index}`}
            />
            {/* {banner?.mobile && (
              <img
                src={banner?.mobile}
                className="mobile-banner"
                height={500}
                width={1200}
                alt={`slide-mobile-${index}`}
              />
            )} */}
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Page;
