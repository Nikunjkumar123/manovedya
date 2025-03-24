"use client";
import React, { useEffect, useState } from "react";
import "./header.css";
import logo from "../../Images/logo.png";
import logo1 from "../../Images/logo1.png";
import Image from "next/image";
import Link from "next/link";
import { getData, postData } from "@/app/services/FetchNodeServices";
import Swal from "sweetalert2";

const Page = () => {
  const [cartSidebar, setCartSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user_token, setUserToken] = useState(null);
  const [User_data, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [couponTitle, setCouponTitle] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("User_data");
    const parsedUser = user ? JSON.parse(user) : null;

    setUserToken(token);
    setUserData(parsedUser);
    setId(parsedUser?._id);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const cartToggle = () => {
    setCartSidebar(!cartSidebar);
  };

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/Pages/aboutUs" },
    { name: "Products", link: "/Pages/products" },
    { name: "Blog", link: "/Pages/blog" },
    { name: "Mind Health Self-Test", link: "/Pages/mind-health" },
    {
      name: "Consultation & Customized Solution",
      link: "/Pages/consultationCustomizedSolution",
    },
    { name: "Track Your Order", link: `/Pages/trackOrder/${id}` },
  ];

  const toggleDecrement = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item, item.quantity - 1);
    }
  };

  const toggleIncrement = (item) => {
    updateCartQuantity(item, item.quantity + 1);
  };

  const updateCartQuantity = async (item, newQuantity) => {
    const updatedItem = { ...item, quantity: newQuantity };
    const body = {
      userId: User_data?._id,
      itemId: item?._id,
      quantity: newQuantity,
    };
    const result = await postData("api/cart/update", body);
    if (result?.success === true) {
      setCart(result?.cart?.items);
    }
  };

  const fetchCart = async () => {
    const result = await getData(`api/cart/get-cart/${id}`);
    if (result?.success === true) {
      setCart(result?.cart?.items);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCart();
    }
  }, [id]);

  const handleAddToCart = async (item, quantity) => {
    if (User_data) {
      const body = {
        userId: User_data?._id,
        itemId: item?._id,
        quantity,
      };
      const result = await postData("api/cart/update", body);
      if (result?.success === true) {
        setCart(result?.cart?.items);
        Swal.fire({
          title: "Item Added!",
          text: "Your item has been added to the cart.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        Swal.fire({
          title: "Item Not Added!",
          text: "Your item could not be added to the cart.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    }
  };

  const handleRemoveItem = async (item) => {
    const body = {
      userId: User_data?._id,
      itemId: item?._id,
    };
    const result = await postData("api/cart/delete-from-cart", body);
    if (result?.success === true) {
      setCart(result?.cart?.items);
      Swal.fire({
        title: "Item Removed!",
        text: "Your item has been removed from the cart.",
        icon: "success",
        confirmButtonText: "Okay",
      });
    } else {
      Swal.fire({
        title: "Item Not Removed!",
        text: "There was an issue removing the item.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const calculateTotal = () =>
    cart?.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTax = () => {
    const totalPrice = calculateTotal();
    return (totalPrice * 0.18).toFixed(2); // 18% tax
  };

  const totalWithTax = () => {
    const totalPrice = calculateTotal();
    const tax = totalPrice * 0.18;
    return (tax + totalPrice).toFixed(2); // Return as string to avoid floating point issues
  };

  useEffect(() => {
    try {
      const fetchCoupon = async () => {
        const status = true;
        const response = await postData(
          `api/coupon/get-coupon-by-status`,
          { status }
        );
        if (response?.success === true) {
          setCouponTitle(response?.coupons || []);
        }
      };
      fetchCoupon();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
      <div className="top-nav">
        <p>
          {couponTitle?.map((item, index) => {
            return (
              <div key={index}>
                {item?.couponTitle}
              </div>
            );
          })}
        </p>
      </div>

      <div className="nav-main">
        <div className="container">
          <div className="nav-logo-section">
            <div className="nav-menu-search">
              <i onClick={toggleSidebar} style={{ cursor: "pointer" }} className="bi bi-list"></i>
              <div className="searchbar">
                <input type="text" placeholder="Search" className="form-control" />
                <i className="bi bi-search"></i>
              </div>
            </div>
            <div className="nav-logo">
              <Link href="/">
                <Image src={logo} width={200} alt="logo-main" />
              </Link>
            </div>
            {user_token ? (
              <div className="login-cart">
                <Link href="/Pages/User_Profile">Profile</Link>
                <i onClick={cartToggle} style={{ cursor: "pointer" }} className="bi bi-cart3"></i>
              </div>
            ) : (
              <div className="login-cart">
                <Link href="/Pages/Login">Log in</Link>
                <i onClick={cartToggle} style={{ cursor: "pointer" }} className="bi bi-cart3"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`cartSidebar ${cartSidebar ? "active" : ""}`}>
        <div className="cart-close-btn">
          <h4>SHOPPING CART</h4>
          <span onClick={cartToggle}><i className="bi bi-x-octagon"></i></span>
        </div>

        <div className="shopping-cart">
          <div className="cart-item">
            {cart?.map((item) => (
              <div key={item._id} style={{ flexDirection: 'column' }}>
                <p className="m-0"><b>{item?.product?.productName}</b></p>
                <p>{item?.product?.variant[0].day} | {item?.product?.variant[0].bottle} | ₹5 / tablet</p>
                <p className="bestseller">⭐ Bestseller</p>
                <p className="price">
                  <span className="original-price">₹{item?.product?.variant[0]?.price * item?.quantity}</span> ₹{item?.price * item?.quantity}
                </p>
                <div className="quantity">
                  <button onClick={() => toggleDecrement(item)} className="decrease">-</button>
                  <span className="count">{item?.quantity}</span>
                  <button onClick={() => toggleIncrement(item)} className="increase">+</button>
                </div>
                <button onClick={() => handleRemoveItem(item)} className="delete-btn mt-2">
                  <i className="bi bi-trash" />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <Link href={`/Pages/Checkout/${User_data?._id}`}>
              <button className="checkout-btn">CHECKOUT</button>
            </Link>
            <Link href={`/Pages/products`}>
              <button className="shop-more-btn">SHOP MORE</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          <Image src={logo} width={100} alt="logo-main" />
          <i className="bi bi-x-octagon"></i>
        </div>
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link href={item.link} onClick={toggleSidebar}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div>
          <div className="d-flex align-items-center">
            <ul className="nav">
              {navItems.map((item, index) => (
                <li key={index} className="nav-item">
                  <Link href={item.link} className="nav-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <Image src={logo1} width={130} alt="logo-main" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Page;