"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./products.css";

import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";

const Page = ({ params }) => {

  const [products, setProducts] = useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      // setIsLoading(true);
      try {
        const response = await getData("api/products/all-product");
        console.log(response);
        if (response.success === true) {
          setProducts(response?.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // toast.error("Failed to fetch products!");
      } finally {
      }
    };

    fetchProducts();
  }, []);

  const truncateText = (text, maxLength = 100) => {
    if (text?.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }
  return (
    <>
      <section className="product-page">
        <div className="container">
          <h2 className="heading">Ayurvedic Products</h2>
          <p className="product-grid-subtitle">
            Explore our range of natural, herbal, and ayurvedic products for a
            healthier lifestyle.
          </p>
          <div className="row">
            {products.map((item) => (
              <div key={item._id} className="col-md-3 col-6 mb-4">
                <Link className="text-black text-decoration-none" href={`/Pages/products/${item?._id}`}>
                  <div data-aos="zoom-in" className="product-card" style={{ padding: 10 }}>
                    <img
                      style={{ width: 300, height: 250 }}
                      src={`${serverURL}/uploads/products/${item?.productImages[0]}`}
                      alt={item.name}
                      className="product-image img-fluid" />
                    <div className="product-details">
                      <h5 className="product-name" style={{height:'5vh'}}>{item?.productName}</h5>
                      <p className="product-desc" style={{ display: '-webkit-flex', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: ' ellipsis' }} >

                        {Parser()?.parse(truncateText(item?.productDescription, 18))}

                      </p>
                      <div className="product-footer">
                        <p className="product-price m-0">
                          <span className="fs-5">₹{item.variant[0]?.price}</span>
                        </p>
                        <p className="product-rating m-0">
                          {item.rating || 5}
                          <i className="bi bi-star"></i> (
                          {item.reviews || 120} reviews)
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div >
      </section >
    </>
  );
};

export default Page;
