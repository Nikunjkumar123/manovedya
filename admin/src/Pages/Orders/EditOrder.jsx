import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData, postData, serverURL } from '../../services/FetchNodeServices';

const EditOrder = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState({});
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const navigate = useNavigate();

    // Fetch API data
    const getApiData = async () => {
        try {
            const res = await getData(`api/orders/get-order-by-id/${id}`);
            console?.log("DATA", res);
            if (res?.success === true) {
                setOrderData(res?.order);
                setOrderStatus(res?.order?.status); // Update the orderStatus based on response
                setPaymentStatus(res?.order?.isPaid ? "Success" : "Pending"); // Set paymentStatus based on `isPaid`
            }
        } catch (error) {
            console?.error("Error fetching order data:", error);
            toast?.error("Failed to fetch order data.");
        }
    };

    useEffect(() => {
        getApiData();
    }, []);

    // Update Order Status and Payment Status
    const handleChangeStatus = async (e) => {
        try {
            // Assuming the API to update the order's status and payment status
            const res = await postData(`api/orders/change-status/${id}`, { orderStatus: e });
            if (res?.success === true) {
                toast?.success("Order updated successfully!");
                getApiData()
            }
        } catch (error) {
            console?.error("Error updating order:", error);
            toast?.error("Failed to update order.");
        }
    };

    // Determine if the "Order Status" dropdown should be disabled
    const isOrderStatusDisabled = orderStatus === "Delivered" || orderStatus === "Cancelled";
    const isPaymentStatusDisabled = paymentStatus === "Success";

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>Update Order</h4>
                </div>
                <div className="links">
                    <Link to="/all-orders" className="btn btn-outline-secondary">Back <i className="fa fa-arrow-left"></i></Link>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card shadow-lg">
                            <div className="card-header bg-primary text-white">
                                <h5 className="card-title">Order Details</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Order ID</th>
                                            <td>{orderData?._id}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">User Name</th>
                                            <td>{orderData?.user?.name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email</th>
                                            <td>{orderData?.user?.email}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Phone Number</th>
                                            <td>{orderData?.user?.phone}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Address</th>
                                            <td>{orderData?.shippingAddress?.addressLine1}, {orderData?.shippingAddress?.addressLine2}, {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.state}, {orderData?.shippingAddress?.pinCode}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Order Date</th>
                                            <td>{new Date(orderData?.createdAt).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Final Price</th>
                                            <td>₹{orderData?.totalAmount}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Order Status</th>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={orderStatus}
                                                    onChange={(e) => handleChangeStatus(e.target.value)}
                                                    disabled={isOrderStatusDisabled}
                                                >
                                                    <option value="orderConfirmed">Order Confirmed</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Mode</th>
                                            <td>{orderData?.paymentMethod}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Id</th>
                                            <td>{orderData?.payment_id}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Status</th>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                                    disabled={isPaymentStatusDisabled}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Success">Success</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-lg">
                            <div className="card-header bg-info text-white">
                                <h5 className="card-title">Ordered Items</h5>
                            </div>
                            <div className="card-body">
                                {orderData?.orderItems && orderData?.orderItems?.length > 0 ? (
                                    orderData?.orderItems.map((item, index) => (
                                        <div key={index} className="mb-3">
                                            <strong>{item?.productId?.productName}</strong><br />
                                            <p className="mb-1">Quantity: {item?.quantity}</p>
                                            <p className="mb-1">Price: ₹{item?.productId?.variant[0]?.finalPrice}</p>
                                            <p className="mb-1">Delivery Period: {item?.productId?.variant[0]?.day || '20 days'}</p>
                                            <p className="mb-0">Bottle Quantity: {item?.productId?.variant[0]?.bottle || 1}</p>
                                            <img
                                                src={`${serverURL}/uploads/products/${item?.productId?.productImages[0]}`}
                                                alt={item?.productId?.productName}
                                                style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                            />
                                            <hr />
                                        </div>
                                    ))
                                ) : (
                                    <p>No items in the cart.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </>
    );
};

export default EditOrder;
