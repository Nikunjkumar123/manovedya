import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { getData } from "../../services/FetchNodeServices";
import { formatDate } from "../../constant";

const ConsultDoctor = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                const response = await getData("api/consultation/all-consultation");
                // console.log('XXXXXXXX', response)
                if (response.status === true) {
                    setAppointments(response?.consultations);
                } else {
                    toast.error("Failed to load appointments");
                }
            } catch (error) {
                toast.error("An error occurred while fetching appointments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This will permanently remove the appointment!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const response = await getData(`api/consultation/delete-consultation/${id}`);
                if (response.status === true) {
                    setAppointments(appointments?.filter((appointment) => appointment?._id !== id));
                    toast.success("Appointment removed successfully");
                }

            }
        } catch (error) {
            toast.error("Failed to remove the appointment");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Consult Doctor Appointments</h4>
                </div>
                {/* <div className="links">
                    <Link to="/add-appointment" className="add-new">
                        Add Appointment <i className="fa-solid fa-plus"></i>
                    </Link>
                </div> */}
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Patient Name</th>
                            <th scope="col">Concern/Challenge</th>
                            <th scope="col">Email</th>
                            <th scope="col">Mobile No.</th>
                            <th scope="col">Schedule Calendar</th>
                            <th scope="col">Schedule Time</th>
                            <th scope="col">Doctor Type</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="text-center">Loading...</td>
                            </tr>
                        ) : appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <tr key={appointment._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{appointment.patientName}</td>
                                    <td>{appointment.concernChallenge}</td>
                                    <td>{appointment.email}</td>
                                    <td>{appointment?.phone}</td>
                                    <td>{formatDate(appointment.scheduleCalendar)}</td>
                                    <td>{appointment.scheduleTime}</td>
                                    <td>{appointment.chooseDoctor}</td>
                                    <td>
                                        <button onClick={() => handleDelete(appointment?._id)} className="bt delete">
                                            Remove <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default ConsultDoctor;
