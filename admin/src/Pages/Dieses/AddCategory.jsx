import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";
import JoditEditor from "jodit-react";

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null,
    categoryStatus: "False",
    faq: [{ question: "", answer: "" }],
    productId: [],
    description: "",
    shortDescription: ""
  });
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  // Fetch All Products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getData("api/products/all-product");
        if (response.success === true) {
          setProductList(response?.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle JoditEditor content change
  const handleJoditChange = (newValue) => {
    setFormData({ ...formData, description: newValue });
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, categoryImage: files[0] }));
    } else if (name === "productId") {
      const selectedProducts = Array.from(e.target.selectedOptions, option => option.value);
      setFormData((prevData) => ({ ...prevData, productId: selectedProducts }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle checkbox change for category status
  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      categoryStatus: prevData.categoryStatus === "True" ? "False" : "True",
    }));
  };

  // Handle FAQ field change
  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFaq = [...formData.faq];
    updatedFaq[index][name] = value;
    setFormData({ ...formData, faq: updatedFaq });
  };

  // Add FAQ to the list
  const addFaq = () => {
    if (formData.faq[formData.faq.length - 1].question && formData.faq[formData.faq.length - 1].answer) {
      setFormData((prevData) => ({
        ...prevData,
        faq: [...prevData.faq, { question: "", answer: "" }],
      }));
    } else {
      toast.error("Please enter both question and answer before adding");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.categoryImage.width !== 300 || formData.categoryImage.height !== 200) {
      return alert("Image must be 300px wide and 200px tall.");
    }

    const uploadData = new FormData();
    uploadData.append("categoryName", formData.categoryName);
    uploadData.append("categoryImage", formData.categoryImage);
    uploadData.append("categoryStatus", formData.categoryStatus);
    uploadData.append("productId", JSON.stringify(formData.productId)); // Ensure product IDs are serialized
    uploadData.append("description", formData.description);
    uploadData.append("shortDescription", formData.shortDescription);

    // Append FAQs to form data
    formData.faq.forEach((faq, index) => {
      uploadData.append(`faq[${index}][question]`, faq.question);
      uploadData.append(`faq[${index}][answer]`, faq.answer);
    });

    try {
      const response = await postData("api/categories/create-category", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.success === true) {
        toast.success(response?.message || 'Category created successfully');
        navigate("/all-dieses");
      }
    } catch (error) {
      toast.error(error.response?.message || "Error adding category");
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Disease</h4>
        </div>
        <div className="links">
          <Link to="/all-dieses" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="categoryName" className="form-label">
              Disease Name
            </label>
            <input
              type="text"
              name="categoryName"
              className="form-control"
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="categoryImage" className="form-label">
              Disease Image  size = w 300* H 200 px only
            </label>
            <input
              type="file"
              name="categoryImage"
              className="form-control"
              id="categoryImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="selectProduct">Select Product</label>
            <select
              multiple
              style={{ height: 100 }}
              name="productId"
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Product</option>
              {productList?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <label htmlFor="" className="form-label">
              Add Short Description
            </label>
            <input
              name="shortDescription"
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">For Information</label>
            <JoditEditor value={formData?.description} onChange={handleJoditChange} />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="categoryActive"
                checked={formData.categoryStatus === "True"}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="categoryActive">
                Active on Homepage
              </label>
            </div>
          </div>

          <hr />
          <div className="col-md-12">
            <div className="head">
              <h4>Add FAQ</h4>
            </div>
          </div>

          {formData.faq.map((faq, index) => (
            <div key={index} className="col-md-6">
              <label className="form-label">Add Question</label>
              <input
                type="text"
                className="form-control"
                name="question"
                value={faq.question}
                onChange={(e) => handleFaqChange(index, e)}
              />
              <label className="form-label">Add Answer</label>
              <input
                type="text"
                className="form-control"
                name="answer"
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, e)}
              />
            </div>
          ))}
          <div className="col-md-12">
            <button type="button" className="btn btn-primary mt-3" onClick={addFaq}>
              Add FAQ
            </button>
          </div>

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
