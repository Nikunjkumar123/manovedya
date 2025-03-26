"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./slider.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Page = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Track active index for dots

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getData("api/banners");
        console.log("Response:", response?.banners);

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

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    beforeChange: (current, next) => setActiveIndex(next), // Update active index before changing slide
  };

  return (
    <div
      id="carouselExampleIndicators"
      style={{ zIndex: 6 }}
    >
      <div className="carousel-indicators" s>
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === activeIndex ? "active" : ""}
            aria-current={index === activeIndex ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActiveIndex(index + 1)}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        <Slider {...settings}>
          {banners?.filter(banner => (isMobile ? banner?.type === "Mobile" : banner?.type === "Desktop"))?.map((banner, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? "active" : ""}`}
            >
              {banner?.type === "Desktop" && <img
                src={`${serverURL}/uploads/banners/${banner?.images[0]}`}
                className="desktop-banner"
                height={500}
                width={1200}
                alt={`slide-${index}`}
              />}
              {banner?.type === "Mobile" && (
                <img
                  src={`${serverURL}/uploads/banners/${banner?.images[0]}`}
                  className="mobile-banner"
                  height={500}
                  width={1200}
                  alt={`slide-mobile-${index}`}
                />
              )}
            </div>
          ))}
        </Slider>
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
