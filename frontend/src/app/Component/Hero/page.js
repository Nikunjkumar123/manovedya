"use client";
import React, { useEffect, useState } from "react";
import image1 from "../../Images/card-pic-1.png";
import image2 from "../../Images/card-pic-2.png";
import image3 from "../../Images/card-pic-3.png";
import "./hero.css";
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";

const Page = ({ title }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([])
  const [diseases, setDiseases] = useState([])


  const fetchAllDisease = async () => {
    try {
      const response = await getData('api/subcategories/get-all-sub-diseases');
      console.log("DATA:GGGGGG", response)
      if (response.success) {
        const activeDiseases = response?.subcategories?.filter(product => product?.isActive === true);
        setDiseases(activeDiseases);
      } else {
        toast.error("Failed to load sub diseases");
      }
    } catch (error) {
      toast.error("An error occurred while fetching sub diseases");
    }
  };


  const fetchProduct = async () => {
    const data = await getData('api/products/all-product');
    // console.log("DATA:", data);
    if (data?.success === true) {
      // Filter the products where isActive is true
      const activeProducts = data?.products.filter(product => product.wellnessKits === true);
      setProducts(activeProducts);
    }
  }
  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData('api/categories/get-All-category');
        if (response.success === true) {
          // setCategories(response?.categories);
          const activecategories = response?.categories.filter(categorie => categorie.isActive === true);
          setCategories(activecategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchAllDisease()
    fetchCategories();
    fetchProduct()
  }, []);


  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <>
      <section className="top-cards">
        <div className="cards-container">
          {categories?.map((categorie, index) => (
            <Link href={`/Pages/product-tips/${categorie?._id}`} key={index}>
              <div data-aos="fade-up" className="card-main">
                <img
                  src={`${serverURL}/uploads/categorys/${categorie.image}`}
                  alt={categorie?.categoryName}
                  className="card-image"
                  width={300}
                  height={200}
                />
                {/* <h3 className="card-title">{categorie?.categoryName}</h3> */}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* <section className="top-cards-slider">
        <div className="container">
          <div className="slider-container">
            <Slider {...settings}>
              {cardArr?.map((card, index) => (
                <div className="card-slide" key={index}>
                  <Link href={card.link}>
                    <div className="card-main">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="card-image"
                        width={300}
                        height={200}
                      />
                      <h3 className="card-title">{card.name}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section> */}

      <section className="ayurved-product">
        <div className="container">
          <h2 className="text-center text-purple">Ayurvedic Wellness Kits</h2>
          <div className="row">
            {products?.map((kit, index) => (
              <div className="col-md-6 col-6 col-lg-4" key={index}>
                <div data-aos="zoom-in" className="product-card">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <Link href={`/Pages/products/${kit?._id}`}>
                        <img
                          src={`${serverURL}/uploads/products/${kit?.productImages[0]}`}
                          alt={kit?.title}
                          className="card-img-top"
                          width={200}
                          height={200}
                          style={{ cursor: "pointer" }}
                        />
                      </Link>
                    </div>
                    <div className="col-md-8">
                      <div className="product-card-details">
                        <h5>{kit?.productName}</h5>
                        <ul>
                          {Parser().parse(kit?.productSubDescription)}
                        </ul>
                        <p className="m-0">
                          <strong>₹ {kit?.variant[0]?.price}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-overview-bg">
        <button className="buy-now">Buy It Now</button>
      </section>

      <section className="MentalHealthCards">
        <div className="container">
          <div className="row justify-content-center">
            {diseases?.map((item, index) => (
              <div
                className="col-lg-2 col-md-4 col-6 health_cards_main"
                key={index}
                onClick={() => localStorage.setItem('diseasData', JSON.stringify({ id: item._id, title: 'diseas' }))}
              >
                <Link href={`/Pages/products`}>
                  <div data-aos="zoom-in-down" className="Mental-card-main shadow-lg">
                    <img
                      src={`${serverURL}/uploads/subcategorys/${item?.image}`}
                      alt={item.name}
                      className="health-card-image"
                      width={100}
                      height={100}
                    />
                    <div className="card-content">
                      <p>{item?.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
