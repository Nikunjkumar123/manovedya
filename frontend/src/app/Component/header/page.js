"use client";
import React, { useEffect, useState } from "react";
import "./header.css";
import logo from "../../Images/logo.png";
import logo1 from "../../Images/logo1.png";
import Image from "next/image";
import Link from "next/link";
import { getData, postData } from "@/app/services/FetchNodeServices";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../redux/slices/user-slice'

const Page = () => {
  // State Variables
  // const selector = useSelector
  const router = useRouter();
  const [cartSidebar, setCartSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [couponTitle, setCouponTitle] = useState([]);
  const dispatch = useDispatch()
  const { carts } = useSelector(state => state.user);
  // console.log("gggggg", carts)
  // Fetch user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("User_data");
    const parsedUser = user ? JSON.parse(user) : null;

    setUserToken(token);
    setUserData(parsedUser);
    setUserId(parsedUser?._id);
  }, []);

  // Cart Sidebar toggle handler
  const cartToggle = () => setCartSidebar(!cartSidebar);

  // Sidebar toggle handler
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Navigation menu items
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
    { name: "Track Your Order", link: `/Pages/trackOrder/${userId}` },
  ];

  // Fetch Cart data
  useEffect(() => {
    if (carts || userId) fetchCart();
  }, [carts, userId]);

  const fetchCart = async () => {
    const result = await getData(`api/cart/get-cart/${userId}`);
    if (result?.success) setCart(result?.cart?.items);
  };

  // Cart quantity update
  const updateCartQuantity = async (item, newQuantity) => {
    const updatedItem = { ...item, quantity: newQuantity };
    const body = {
      userId: userData?._id,
      itemId: item?._id,
      quantity: newQuantity,
    };
    const result = await postData("api/cart/update", body);
    if (result?.success) setCart(result?.cart?.items);
  };


  const handleAddToCart = async (item, quantity) => {
    if (userData) {
      const body = {
        userId: userData?._id,
        itemId: item?._id,
        quantity,
      };
      const result = await postData("api/cart/update", body);
      if (result?.success) {
        setCart(result?.cart?.items);
        dispatch(login(result?.cart));
        Swal.fire({
          title: "Item Added!",
          text: "Your item has been added to the cart.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        // window.location.reload()
        // router.push(`/Pages/cart/${userData?._id}`)
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

  // Handle item removal from cart
  const handleRemoveItem = async (item) => {
    const body = {
      userId: userData?._id,
      itemId: item?._id,
    };
    const result = await postData("api/cart/delete-from-cart", body);
    if (result?.success) {
      setCart(result?.cart?.items);
      dispatch(login(result?.cart));
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

  // Calculate total price of items in cart
  const calculateTotal = () =>
    cart?.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate tax (18%)
  const calculateTax = () => {
    const totalPrice = calculateTotal();
    return (totalPrice * 0.18).toFixed(2);
  };

  // Calculate total with tax
  const totalWithTax = () => {
    const totalPrice = calculateTotal();
    const tax = totalPrice * 0.18;
    return (tax + totalPrice).toFixed(2);
  };

  // Fetch coupon data
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await postData("api/coupon/get-coupon-by-status", {
          status: true,
        });
        if (response?.success) setCouponTitle(response?.coupons || []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCoupon();
  }, []);

  return (
    <>
      {/* Top Nav for Coupons */}
      <div className="top-nav">
        <p>
          {couponTitle?.map((item, index) => (
            <div key={index}>{item?.couponTitle}</div>
          ))}
        </p>
      </div>

      {/* Main Navbar */}
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
            {userToken ? (
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
              <div key={item._id} style={{ flexDirection: "column" }}>
                <p className="m-0"><b>{item?.product?.productName}</b></p>
                <p>{item?.product?.variant[0].day} | {item?.product?.variant[0].bottle} | ₹5 / tablet</p>
                <p className="bestseller">⭐ Bestseller</p>
                <p className="price">
                  <span className="original-price">₹{item?.product?.variant[0]?.price * item?.quantity}</span> ₹{item?.price * item?.quantity}
                </p>
                <div className="quantity">
                  <button disabled={item?.quantity <= 1} onClick={() => handleAddToCart(item, item.quantity - 1)} className="decrease">-</button>
                  <span className="count">{item?.quantity}</span>
                  <button onClick={() => handleAddToCart(item, item.quantity + 1)} className="increase">+</button>
                </div>
                <button onClick={() => handleRemoveItem(item)} className="delete-btn mt-2">
                  <i className="bi bi-trash" />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <Link href={`/Pages/Checkout/${userData?._id}`}>
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
