"use client";
import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import "../../products/products.css";
import '../../productDetails/productDetails.css'
import productimg1 from "../../../Images/product-details1.png";
import productimg2 from "../../../Images/product-details2.png";
import productimg3 from "../../../Images/product-details3.png";
import paymentImage1 from "../../../Images/payment-img1.png";
import paymentImage2 from "../../../Images/payment-img2.png";
import paymentImage3 from "../../../Images/payment-img3.png";
import paymentImage4 from "../../../Images/payment-img4.png";
import paymentImage5 from "../../../Images/payment-img5.png";
import reviewImage from "../../../Images/reviewImage1.png";
import ingredentImage1 from "../../../Images/ingrediantsImage1.png";
import ingredentImage2 from "../../../Images/ingrediantsImage2.png";
import ingredentImage3 from "../../../Images/ingrediantsImage3.png";
import ingredentImage4 from "../../../Images/ingrediantsImage4.png";
import googleImage from "../../../Images/googleImage.svg";
import ProductBlog from "../../../Component/ProductBlog/page";
import { getData, postData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

const Page = ({ params }) => {
  // Unwrap the params with React.use()
  const { id } = use(params);
  const { name } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [User_data, setUser_data] = useState(null)
  const [user_token, setUser_token] = useState(null)
  const [buttonText, setButtonText] = useState('BUY IT NOW')
  const [btn, setBtn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('User_data')
    const User_data = JSON.parse(user)
    setUser_data(User_data)
    const user_token = localStorage.getItem('token')
    setUser_token(user_token)
  }, [])
  ////////////////////////////////////////////////////////////////////////

  const fetchProductById = async () => {
    const data = await getData(`api/products/get_product_by_id/${id}`)
    console.log("productDetail:-", data)
    if (data.success === true) {
      setProduct(data?.product)
    }
  }

  useEffect(() => {
    fetchProductById()
  }, [id])

  //////////////////////////////////////////////////////////////////////
  const handleSelect = (index, item) => {
    setSelectedIndex(index);
    localStorage.setItem("productItem", JSON.stringify(item))
    // console.log("item", item)
    setBtn(true)
  };


  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  const review = [
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 5,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
    // Add more review objects as needed
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 4,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 5,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
  ];
  const reviews = [
    { stars: 5, percentage: 10, count: 249 },
    { stars: 4, percentage: 10, count: 0 },
    { stars: 3, percentage: 10, count: 0 },
    { stars: 2, percentage: 10, count: 0 },
    { stars: 1, percentage: 10, count: 0 },
  ];


  const handleCartSubmit = async () => {
    if (user_token) {
      const quantity = 1
      const item = localStorage.getItem("productItem")

      let body = { userId: User_data?._id, productId: product?._id, quantity, item }
      const result = await postData('api/cart/add-to-cart', body)
      if (result?.success === true) {
        console.log("result", result);
        setCart(result?.cart)
        Swal.fire({
          title: "Item Added!",
          text: "Your item has been added to the cart.",
          icon: "success",
          confirmButtonText: "Okay",
        }).then(() => {
          setButtonText("Go to Cart");
        });
      } else {
        Swal.fire({
          title: "Item Added!",
          text: "Your item has been not added to the cart.",
          icon: "error",
          confirmButtonText: "Okay",
        }).then(() => {
          setButtonText("BUY IT NOW");
        });
      }
    } else {
      // window.location.href = `/Pages/login`
      router.push('/Pages/login')
    }
  }


  const goToCart = () => {
    if (user_token) {
      // window.location.href = `/Pages/cart/${User_data?._id}`
      router.push(`/Pages/cart/${User_data?._id}`)
    }
  }
  // console.log("XXXXXXXXXXXXXXXX", product?.urls[0].url)

  return (
    <>
      <section className="product-details-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Slider
                asNavFor={nav2}
                ref={(slider) => {
                  setNav1(slider);
                  sliderRef1.current = slider;
                }}
              >
                {product?.productImages?.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`${serverURL}/uploads/products/${image}`}
                      alt={`Slide ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "fill",
                      }}
                    />
                  </div>
                ))}
              </Slider>

              <Slider
                asNavFor={nav1}
                ref={(slider) => {
                  setNav2(slider);
                  sliderRef2.current = slider;
                }}
                autoplay={true}
                autoplaySpeed={3000}
                infinite={true}
                pauseOnHover={true}
                slidesToShow={4}
                swipeToSlide={true}
                focusOnSelect={true}
              >
                {product?.productImages?.map((image, index) => (
                  <div className="product-mini-images" key={index}>
                    <img
                      src={`${serverURL}/uploads/products/${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "95%", height: "100%" }}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <div className="col-md-6">
              <div className="product-details">
                <h1>{product.productName}</h1>
                <p className="product-detail-desc">{Parser().parse(product?.productDescription)}</p>

                {/* Price & Rating */}
                <div className="product-price-rating">
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Image
                      src={googleImage} // Replace with an actual Google logo image path
                      alt="Google Logo"
                      width={30}
                    />
                    <span style={{ fontWeight: "bold", fontSize: "30px" }}>
                      {product.rating}
                    </span>
                    <span style={{ color: "#FFD700", fontSize: "28px" }}>★★★★</span>
                  </div>

                  <p className="m-0">
                    <span style={{ color: "var(--purple)", fontWeight: '600', }}>{product.reviews}+ reviews</span>
                  </p>
                </div>

                {/* Features List */}
                <p >Helping In</p>
                <ul>
                  {Parser().parse(product?.productSubDescription)}
                </ul>

                {/* Pricing Options */}
                <hr />
                <div className="product-detail-smrini">
                  <h2>SMRINI</h2>
                  <div className="row">
                    {product?.variant?.map((item, index) => (
                      <div className="col-md-4 col-6" key={index}>
                        <div
                          className={`product-detail-card ${selectedIndex === index ? "selected" : ""}`}
                          onClick={() => handleSelect(index, item)}
                        >
                          {selectedIndex === index && <span className="tick-mark">✔</span>}
                          <p className="smrini-duration">{item?.duration}</p>
                          <p className="smrini-bottle">{item?.bottle}</p>
                          <hr />
                          <p className="smrini-original-price">
                            ₹ <del>{item?.price}</del>
                          </p>
                          <p className="smrini-price">₹ {item?.finalPrice}</p>
                          <p className="smrini-discount">{item?.discountPrice}% Off</p>
                          <p className="smrini-taxes">{item?.tex} Taxes</p>
                          <p className="smrini-saving">Save ₹ {item?.savings}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buy Now Button */}
                  {/* <div className="col-md-12">
                    <Link href={user_token ? `/Pages/cart/${product?._id}` : '/Pages/Login'} className="bynowbtn mt-3">
                      BUY IT NOW
                    </Link>
                  </div> */}
                  {buttonText === "BUY IT NOW" ? <div className="col-md-12">
                    <div onClick={user_token ? btn ? handleCartSubmit : () => (alert('Select Price')) : '/Pages/Login'} className="bynowbtn mt-3">
                      {buttonText}
                    </div>
                  </div> : <div className="col-md-12">
                    <div onClick={user_token ? goToCart : '/Pages/Login'} className="bynowbtn mt-3">
                      {buttonText}
                    </div>
                  </div>}

                  {/* Payment Images */}
                  <div className="col-md-12">
                    <div className="payment-images">
                      {product?.paymentImages?.map((image, index) => (
                        <Link href="/" key={index}>
                          <Image src={image} alt="Payment Option" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ingredients-detail">
        <div className="container">
          <h2>Herbs for Natural</h2>
          <div className="row">
            {product?.herbsId?.map((item, index) => (
              <div key={index} className="col-md-4 col-6">
                <div className="ingredent-main">
                  <img src={`${serverURL}/uploads/herbs/${item?.images[0]}`} alt="ingredents-image" />
                  <p>{item?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="ingredients-accordion">
        <div className="container">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {product?.faqs?.map((item) => (
              <div className="accordion-item" key={item?._id}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item?._id}`}
                    aria-expanded="false"
                    aria-controls={item?._id}
                  >
                    {item?.question}
                  </button>
                </h2>
                <div id={item?._id} className="accordion-collapse collapse" aria-labelledby={item?._id} data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">{item?.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-blog-section">
        <ProductBlog product={product} title="Single Product" />
      </section>

      <section className="doctor-advice-videos">
        <div className="container">
          <h2>Doctor's Advice</h2>
          <div className="row">
            {product?.urls?.map((video) => (<>
              {console.log(`${video?.url}`)}
              <div className="col-md-4 col-6" key={video?._id}>
                <div className="video-card">
                  <iframe
                    width="100%"
                    height="250"
                    src={video?.url}
                    title={`Doctor's Advice - ${video?._id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </>))}
          </div>
        </div>
      </section>

      <section className="customer-reviews-advice py-4">
        <div className="container">
          <h4>Customer Reviews Advice</h4>
          <hr />
          <p className="mb-3">Based on 2495 reviews</p>
          <div className="reviews-list">
            {reviews?.map((review, index) => (
              <div className="row align-items-center mb-3" key={index}>
                <div className="col-3 col-md-2">
                  <div className="stars">
                    {[...Array(review?.stars)]?.map((_, i) => (
                      <span key={i} className="text-warning">
                        &#9733;
                      </span>
                    ))}
                    {[...Array(5 - review?.stars)]?.map((_, i) => (
                      <span key={i} className="text-muted">
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-6 col-md-8">
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${review?.percentage}%` }}
                      aria-valuenow={review?.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <div className="col-3 col-md-2">
                  <small>
                    {review?.percentage}% ({review?.count})
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="review-section">
        <div className="container">
          <h2 className="mb-4">
            <strong>Review</strong>
          </h2>
          <div className="row">
            {review?.map((review, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <Image
                        src={review?.profileImage}
                        alt={review?.name}
                        className="rounded-circle me-3"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <div>
                        <h6 className="mb-0">{review?.name}</h6>
                        <small className="text-muted">{review?.date}</small>
                      </div>
                    </div>
                    <h6 className="card-tit">{review?.reviewTitle}</h6>
                    <p className="card-text">{review?.reviewText}</p>
                    <div className="d-flex align-items-center">
                      <span className="text-warning me-2">
                        {[...Array(5)]?.map((_, i) => (
                          <i
                            key={i}
                            className={`fa${i < review?.rating ? "s" : "r"
                              } fa-star`}
                          ></i>
                        ))}
                      </span>
                      <hr />
                      <small className="text-muted ms-auto">
                        <i className="bi bi-hand-thumbs-up"></i>
                        {review?.likes}
                      </small>
                      <small className="text-muted ms-3">
                        <i className="bi bi-hand-thumbs-down"></i>
                        {review?.dislikes}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>

  );
};

export default Page;