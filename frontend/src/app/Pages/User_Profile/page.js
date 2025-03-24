"use client";

import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserProfile() {
    const router = useRouter();
    const [selectedSection, setSelectedSection] = useState('dashboard');
    const [user_data, setUser_data] = useState('');

    useEffect(() => {
        const data = localStorage.getItem("User_data");
        const user_data = JSON.parse(data);
        setUser_data(user_data);
    }, [])

    const AccountDetails = () => {
        return (
            <div style={{
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '800px',
                marginTop: '20px',
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                }}>Account Details</h2>
                <table style={{
                    borderCollapse: 'collapse',
                    width: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>
                    <tbody>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>Name:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}> {user_data?.name}</td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>E-mail:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}> {user_data?.email}</td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>Address:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}>{user_data?.address?.addressLine1}</td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>Address 2:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}>{user_data?.address?.addressLine2}</td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>Country:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}>{user_data?.address?.state} , {user_data?.address?.country}</td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>Zip:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}>{user_data?.address?.pinCode}</td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}><strong>Phone:</strong></td>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #ddd',
                                textAlign: 'left',
                            }}>{user_data?.phone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const handleLOGOUT = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                localStorage.clear("User_data");
                localStorage.clear("token");
                // window.location.href = "/";
                router?.push("/");
                Swal.fire('Deleted!', 'Your coupon has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'There was an error deleting the coupon.', 'error');
                console.error('Error deleting coupon:', error);
            }
        }
    };

    // Function to render different sections
    const renderContent = () => {
        switch (selectedSection) {
            case 'dashboard':
                return <div style={{ marginTop: '20px', padding: '20px' }} >
                    {AccountDetails()}
                </div>;
            case 'logout':
                return <div style={{ marginTop: '20px', fontSize: '18px', color: '#333', fontWeight: 'normal', }}>
                    {handleLOGOUT()}</div>;
            default:
                return <div style={{
                    marginTop: '20px',
                    fontSize: '18px',
                    color: '#333',
                    fontWeight: 'normal',
                }}>Please select a section.</div>;
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: '#f4f7fc', height: '100vh', alignItems: 'center', }}>
            <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '90%', maxWidth: '1200px', padding: '20px', gap: '2rem', }}>
                <div style={{ width: '250px', height: '30vh', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '1rem', }}>
                    <div style={{ padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s', textAlign: 'center', }}
                        onClick={() => setSelectedSection('dashboard')}>
                        Dashboard
                    </div>
                    <div style={{ padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s', textAlign: 'center', }}
                        onClick={() => router.push(`/Pages/trackOrder/${user_data?._id}`)}>
                        Your Orders
                    </div>
                    <div
                        style={{ padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s', textAlign: 'center', }}
                        onClick={() => setSelectedSection('logout')}>
                        Log Out
                    </div>
                </div>
                <div style={{ flex: 1, width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem', }}>
                    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                            {user_data?.name}
                        </h3>
                        <p style={{ fontSize: '16px', color: '#555', }}>
                            {user_data?.email}
                        </p>

                    </div>
                    <div style={{ width: '100%' }}>{renderContent()}</div>
                </div>
            </div>
        </div>
    );
}
