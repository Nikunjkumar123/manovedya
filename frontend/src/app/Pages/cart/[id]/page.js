"use client";

import "./addCart.css";
import Swal from "sweetalert2";
import { use, useEffect, useState } from "react";
import { getData, postData, serverURL } from "@/app/services/FetchNodeServices";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { login } from '../../../redux/slices/user-slice'
import { useDispatch, useSelector } from "react-redux";


const CartPage = ({ params }) => {
    const { id } = use(params);  // Destructure from params directly
    const dispatch = useDispatch()
    const { carts } = useSelector(state => state.user);
    const [User_data, setUser_data] = useState([]);
    const [cart, setCart] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('User_data') || null
        const User_data = JSON.parse(user)
        setUser_data(User_data)
    }, [])
    const fetchCart = async () => {
        const result = await getData(`api/cart/get-cart/${id}`);
        console.log("XXXXXXXXXXXXX", result)
        if (result?.success === true) {
            setCart(result?.cart?.items);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [carts]);


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

    const handleAddToCart = async (item, quantity) => {
        if (User_data) {
            const updatedItem = { ...item, quantity };
            console.log("updatedItem", updatedItem)
            const body = {
                // ...updatedItem,
                userId: User_data?._id,
                itemId: item?._id,
                quantity,
            };
            const result = await postData('api/cart/update', body);
            if (result?.success === true) {
                setCart(result?.cart?.items);
                console.log("result?.cart?.items", result?.cart.items)
                const t = result?.cart.items
                dispatch(login(result?.cart));
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
        } else {
            router.push('/Pages/login');
        }
    };

    const handleRemoveItem = async (item) => {
        const body = {
            userId: User_data?._id,
            itemId: item?._id,
        };
        console.log(body)
        const result = await postData('api/cart/delete-from-cart', body);
        if (result?.success === true) {
            setCart(result?.cart?.items);
            Swal.fire({
                title: "Item Removed!",
                text: "Your item has been removed from the cart.",
                icon: "success",
                confirmButtonText: "Okay",
            });
            dispatch(login(result?.cart));

        } else {
            Swal.fire({
                title: "Item Not Removed!",
                text: "There was an issue removing the item.",
                icon: "error",
                confirmButtonText: "Okay",
            });
        }
    };

    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="heading">
                        <h1>Your Cart</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="cart-item-data-container">
                            <h4>Cart Items</h4>
                            <hr />
                            {cart?.length === 0 ? (
                                <div className="text-center">
                                    <h5>Your cart is empty</h5>
                                    <Link href="/Pages/products" className="btn" style={{ backgroundColor: "#050f3d", color: "#fff" }}>
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                cart?.map((item) => (
                                    <div className="cart-item-data" style={{ margin: '5px 0px 5px 0px' }} key={item._id}>
                                        <div className="cart-product-image" style={{ width: '15%' }}>
                                            <img src={`${serverURL}/uploads/products/${item?.product?.productImages[0]}`} alt={item?.product?.productName} />
                                        </div>
                                        <div style={{ width: '30%', }}>
                                            <h4>{item?.product?.productName}</h4>
                                        </div>
                                        <div style={{ display: 'flex', width: '10%', justifyContent: 'space-between' }}>
                                            <button
                                                style={{ padding: 5, fontWeight: 500, fontSize: '1.5rem', background: '#a665b3', border: 'none', borderRadius: '5px', color: '#fff' }}
                                                onClick={() => handleAddToCart(item, item?.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="quantity"
                                            >
                                                &#8722;
                                            </button>
                                            <span style={{ padding: 5, fontWeight: 500, fontSize: '1.5rem' }}>{item.quantity}</span>
                                            <button
                                                style={{ padding: 5, fontWeight: 500, fontSize: '1.5rem', background: '#a665b3', border: 'none', borderRadius: '5px', color: '#fff' }}
                                                className="quantity"
                                                onClick={() => handleAddToCart(item, item?.quantity + 1)}
                                            >
                                                &#43;
                                            </button>
                                        </div>
                                        <div className="cart-product-price" style={{ width: '18%', }}>
                                            <h4>₹{item.price * item.quantity}</h4>
                                        </div>
                                        <div className="cart-product-delete">
                                            <button onClick={() => handleRemoveItem(item)} className="border-0 bg-white">
                                                <i className="bi bi-trash3 text-danger"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                            <hr />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="cart-price-data">
                            <div className="subtotal">
                                <h4>Subtotal: </h4>
                                <h4><i className="bi bi-currency-rupee"></i>{calculateTotal()}</h4>
                            </div>
                            <hr />
                            <div className="subtotal">
                                <h4>Tax:</h4>
                                <h4><i className="bi bi-currency-rupee"></i>{calculateTax()}</h4>
                            </div>
                            <hr />
                            <div className="subtotal">
                                <h4>Shipping:</h4>
                                <h4><i className="bi bi-currency-rupee"></i>75</h4>
                            </div>
                            <hr />
                            <div className="subtotal">
                                <h4>Total:</h4>
                                <h4><i className="bi bi-currency-rupee"></i>{totalWithTax()}</h4>
                            </div>
                            <div className="cart-payment">
                                <Link href={`/Pages/Checkout/${User_data?._id}`}>
                                    <button className="payment-confirm" style={{ background: '#a665b3' }}>Confirm Order</button>
                                </Link>
                                <Link href="/Pages/products">
                                    <button className="continue-shopping">Continue Shopping</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
