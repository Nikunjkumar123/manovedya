"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./UserProfile.module.css"; // Import the CSS file
import { getData } from "@/app/services/FetchNodeServices";

export default function UserProfile() {
    const router = useRouter();
    const [selectedSection, setSelectedSection] = useState("dashboard");
    const [user_data, setUser_data] = useState("");
    const [appointments, setAppointments] = useState([]);

    // Fetch user data from localStorage
    useEffect(() => {
        const data = localStorage.getItem("User_data");
        if (data) {
            const parsedUserData = JSON.parse(data);
            setUser_data(parsedUserData);
        }
    }, []);

    // Fetch appointments if user data is available
    useEffect(() => {
        const fetchAppointments = async () => {
            if (user_data?._id) {
                try {
                    const response = await getData(`api/consultation/get-consultation-user/${user_data?._id}`);
                    const data = await response.data;
                    console.log("Fetched Appointments:", data);

                    if (response.status === true) {
                        setAppointments(data);
                    }
                } catch (error) {
                    console.error("Error fetching appointments:", error);
                }
            }
        };

        fetchAppointments();
    }, [user_data]);

    // Display account details
    const AccountDetails = () => {
        return (
            <div className={styles.table}>
                <h2 className={styles.tableHeader}>Account Details</h2>
                <table className={styles.tableContent}>
                    <tbody>
                        <tr className={styles.tableRow}>
                            <td><strong>Name:</strong></td>
                            <td>{user_data?.name}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td><strong>E-mail:</strong></td>
                            <td>{user_data?.email}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td><strong>Address:</strong></td>
                            <td>{user_data?.address?.addressLine1}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td><strong>Address 2:</strong></td>
                            <td>{user_data?.address?.addressLine2}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td><strong>Country:</strong></td>
                            <td>{user_data?.address?.state}, {user_data?.address?.country}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td><strong>Zip:</strong></td>
                            <td>{user_data?.address?.pinCode}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td><strong>Phone:</strong></td>
                            <td>{user_data?.phone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    // Logout function with confirmation
    const handleLOGOUT = async () => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, log out!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                localStorage.removeItem("User_data");
                localStorage.removeItem("token");
                router?.push("/");
                Swal.fire("Logged out!", "You have been logged out.", "success");
            } catch (error) {
                Swal.fire("Error!", "There was an error logging out.", "error");
                console.error("Error logging out:", error);
            }
        }
    };

    // Display appointment details
    const AppointmentDetails = () => {
        if (appointments.length === 0) {
            return (
                <div className={styles.table}>
                    <h2 className={styles.tableHeader}>Appointments</h2>
                    <p>You have no appointments.</p>
                </div>
            );
        }

        return (
            <div className={styles.table}>
                <h2 className={styles.tableHeader}>Appointments</h2>
                <table className={styles.tableContent}>
                    {appointments?.map((appointment) => (
                        <div style={{ gap: 10, marginBottom: 10, boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px', padding: 10 }} key={appointment._id}>
                            <tbody>
                                <tr className={styles.tableRow}>
                                    <td><strong>Patient Name:</strong></td>
                                    <td>{appointment?.patientName}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td><strong>Consultation Date:</strong></td>
                                    <td>{new Date(appointment?.scheduleCalendar).toLocaleDateString()}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td><strong>Schedule Time:</strong></td>
                                    <td>{appointment?.scheduleTime}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td><strong>Doctor:</strong></td>
                                    <td>{appointment?.chooseDoctor}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td><strong>Status:</strong></td>
                                    <td>{appointment?.status}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td><strong>Payment ID:</strong></td>
                                    <td>{appointment?.payment_id}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td><strong>Amount:</strong></td>
                                    <td>{appointment?.amount}</td>
                                </tr>
                            </tbody>
                        </div>
                    ))}
                </table>
            </div>
        );
    };

    // Render content based on the selected section
    const renderContent = () => {
        switch (selectedSection) {
            case "dashboard":
                return <div>{AccountDetails()}</div>;
            case "logout":
                return (
                    <div>
                        {handleLOGOUT()}
                    </div>
                );
            case "appointment":
                return <div>{AppointmentDetails()}</div>;
            default:
                return <div>Please select a section.</div>;
        }
    };

    // Handle button click for active section highlighting
    const handleSectionClick = (section) => {
        setSelectedSection(section);
    };

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.sidebar}>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "dashboard" ? styles.active : ""}`}
                        onClick={() => handleSectionClick("dashboard")}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "order" ? styles.active : ""}`}
                        onClick={() => router.push(`/Pages/trackOrder/${user_data?._id}`)}
                    >
                        Your Orders
                    </div>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "appointment" ? styles.active : ""}`}
                        onClick={() => handleSectionClick("appointment")}
                    >
                        Your Appointments
                    </div>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "logout" ? styles.active : ""}`}
                        onClick={() => handleSectionClick("logout")}
                    >
                        Log Out
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.profileHeader}>
                        <h3>{user_data?.name}</h3>
                        <p>{user_data?.email}</p>
                    </div>
                    <div>{renderContent()}</div>
                </div>
            </div>
        </div>
    );
}
