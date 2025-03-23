import axios from "axios";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";

const AddMindHealthTest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const editor = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        testTitle: "",
        description: "",
        themeColor: "#000000", // Default color picker value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/create-mind-health-test",
                formData
            );

            toast.success(response.data.message);
            navigate("/mind-health-test");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding test");
            console.error("Error adding test:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Mental Health Test</h4>
                </div>
                <div className="links">
                    <Link to="/mind-health-test" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    {/* Test Title */}
                    <div className="col-md-3">
                        <label htmlFor="testTitle" className="form-label">
                            Test Title
                        </label>
                        <input
                            type="text"
                            name="testTitle"
                            className="form-control"
                            id="testTitle"
                            value={formData.testTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Color Picker */}
                    <div className="col-md-3 text-ce">
                        <label htmlFor="themeColor" className="form-label">
                            Select Card Background Color
                        </label>
                        <input
                            type="color"
                            name="themeColor"
                            className="form-control form-control-color"
                            id="themeColor"
                            value={formData.themeColor}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="col-md-12">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <JoditEditor
                            ref={editor}
                            value={formData.description}
                            onChange={(newContent) =>
                                setFormData((prevData) => ({ ...prevData, description: newContent }))
                            }
                        />
                    </div>

                    

                    {/* Submit Button */}
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={isLoading ? "not-allowed" : "allowed"}
                        >
                            {isLoading ? "Please Wait..." : "Add Test"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddMindHealthTest;
