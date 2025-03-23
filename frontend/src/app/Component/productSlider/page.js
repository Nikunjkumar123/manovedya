"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "./productSlider.css";
import image1 from "../../Images/product-1.png";
import image2 from "../../Images/product-2.png";
import image3 from "../../Images/product-3.png";
import image4 from "../../Images/product-4.jpg";
import image5 from "../../Images/product-5.jpg";
import icon from "../../Images/pure-ingredents.png";
import icon1 from "../../Images/eco-friendly.png";
import icon2 from "../../Images/eco-friendly.png";
import icon3 from "../../Images/expert-crafted.png";
import icon4 from "../../Images/health.png";
import icon5 from "../../Images/delivery.png";
import icon6 from "../../Images/pan-india.png";
import icon7 from "../../Images/costomer-support.png";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Link from "next/link";

const Page = () => {
  const [products, setProducts] = useState([])

  const fetchProduct = async () => {
    const data = await getData('api/products/all-product');
    console.log("DATA:", data);
    if (data?.success === true) {
      // Filter the products where isActive is true
      const activeProducts = data?.products.filter(product => product.isActive === true);
      setProducts(activeProducts);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      <section className="product-slider">
        <div className="container">
          <h2 className="product-slider-title">Ayurvedic Products</h2>
          <p className="product-slider-subtitle">
            Explore our range of natural, herbal, and ayurvedic products for a
            healthier lifestyle.
          </p>
          <div className="slider-container">
            <Slider {...settings}>
              {products?.map((item, index) => (

                <div data-aos="zoom-out-up" key={index} className="product-slider-card">
                  <Link href={`/Pages/products/${item?._id}`}>
                    <img
                      src={`${serverURL}/uploads/products/${item?.productImages[0]}`}
                      alt={item?.productName}
                      className="product-slider-image"
                      style={{ width: 300, height: 250, cursor: 'pointer' }}
                    />
                  </Link>
                  <div className="product-slider-details">
                    <h5 className="product-slider-name" style={{ height: '4vh' }}>{item?.productName}</h5>
                    <ul style={{ height: '10vh' }}>
                      {Parser()?.parse(item?.productSubDescription)}
                    </ul>
                    <p className="product-slider-desc">{item.desc}</p>
                    <div className="product-slider-footer">
                      <p className="product-slider-price">₹ {item?.variant[0]?.price}</p>
                      <p className="product-slider-rating">
                        {item.rating || 5} <i className="bi bi-star"></i> (
                        {item.reviews || 120} reviews)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div >
      </section >
      <section className="manovedya-hero-about">
        <div className="container">
          <h2 className="manovedya-title">Manovaidya</h2>
          <p className="manovedya-description">
            Manovaidya - where ancient Ayurveda meets modern mental wellness.
            We’re here to help you find balance with natural, herbal solutions
            crafted to support your mental health, whether you’re dealing with
            anxiety, depression, or just everyday stress. Our products are
            inspired by age-old traditions and perfected with science to fit
            seamlessly into your life helping you find balance, calm, and
            clarity—naturally.
          </p>
          <h3 className="manovedya-subtitle">
            Premium Ayurvedic wellness, embracing nature with zero compromise.
          </h3>

          <div className="row feature-row">
            <div data-aos="zoom-in-right" className="col-md-3 col-6 text-center">
              <Image
                src={icon1}
                alt="Pure Ingredients"
                className="manovedya-icon"
              />
              <h4 className="feature-title">Pure Ingredients</h4>
              <p className="feature-description">
                100% Ayurvedic, no artificial chemicals.
              </p>
            </div>
            <div data-aos="zoom-in-right" className="col-md-3 col-6 text-center">
              <Image
                src={icon2}
                alt="Eco-Friendly"
                className="manovedya-icon"
              />
              <h4 className="feature-title">Eco-Friendly</h4>
              <p className="feature-description">
                Cruelty-free, sustainable practices.
              </p>
            </div>
            <div data-aos="zoom-in-left" className="col-md-3 col-6 text-center">
              <Image
                src={icon3}
                alt="Expert Crafted"
                className="manovedya-icon"
              />
              <h4 className="feature-title">Expert Crafted</h4>
              <p className="feature-description">
                Formulated by expert vaidyas.
              </p>
            </div>
            <div data-aos="zoom-in-left" className="col-md-3 col-6 text-center">
              <Image
                src={icon4}
                alt="Health Solutions"
                className="manovedya-icon"
              />
              <h4 className="feature-title">Health Solutions</h4>
              <p className="feature-description">
                Wide range for varied wellness needs.
              </p>
            </div>
          </div>

          <div className="row feature-row m-0">
            <div data-aos="zoom-out" className="col-md-4 col-6 text-center">
              <Image
                src={icon5}
                alt="Free Delivery"
                className="manovedya-icon"
              />
              <p className="feature-highlight">Free Delivery Above ₹ 350</p>
            </div>
            <div data-aos="zoom-out" className="col-md-4 col-6 text-center">
              <Image
                src={icon6}
                alt="Shipping PAN India"
                className="manovedya-icon"
              />
              <p className="feature-highlight">Shipping PAN India</p>
            </div>
            <div data-aos="zoom-out" className="col-md-4 col-6 text-center">
              <Image
                src={icon7}
                alt="Quick Customer Support"
                className="manovedya-icon"
              />
              <p className="feature-highlight">Quick Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
