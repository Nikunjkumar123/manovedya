import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";
import JoditEditor from "jodit-react";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null,
    categoryStatus: false,
    shortDescription: "",
    description: "",
    productId: ""
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getData(`api/categories/get-category-by-id/${id}`);
        console.log(response);
        if (response?.success) {
          setFormData({
            ...response?.category,
            categoryName: response?.category?.categoryName,
            shortDescription: response?.category?.shortDescription,
            description: response?.category?.description,
            productId: response?.category?.productId,
            categoryStatus: response?.category?.isActive,
            categoryImage: response?.category?.image || null // Ensuring the image is populated if available
          });
        }
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Error fetching category:", error);
      }
    };

    const fetchProducts = async () => {
      setBtnLoading(true);
      try {
        const response = await getData("api/products/all-product");
        console.log("response", response);
        if (response.success) {
          setProductList(response?.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products!");
      } finally {
        setBtnLoading(false);
      }
    };

    fetchCategory();
    fetchProducts();
  }, [id]);

  const handleJoditChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      description: newValue
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const payload = new FormData();
    payload.append("categoryName", formData.categoryName);
    if (formData.categoryImage) {
      payload.append("categoryImage", formData.categoryImage); // Ensure correct field name in backend
    }
    payload.append("categoryStatus", formData.categoryStatus ? "True" : "False");
    payload.append("shortDescription", formData.shortDescription);
    payload.append("description", formData.description);
    payload.append("productId", formData.productId);

    try {
      const response = await postData(`api/categories/update-category/${id}`, payload);
      console.log(response)
      if (response?.success === true) {
        toast.success(response.message);
        navigate("/all-dieses");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating category");
      console.error("Error updating category:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Category</h4>
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
              Category Name
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
              Category Image
            </label>
            <input
              type="file"
              name="categoryImage"
              className="form-control"
              id="categoryImage"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="selectProduct">Select Product</label>
            <select
              multiple
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="form-control"
            >
              <option>Select Product</option>
              {productList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <label htmlFor="shortDescription" className="form-label">
              Add Short Description
            </label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">For Information</label>
            <JoditEditor
              value={formData.description}
              onChange={handleJoditChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="categoryStatus"
                id="categoryStatus"
                checked={formData.categoryStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="categoryStatus">
                Active on Homepage
              </label>
            </div>
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              className={`${btnLoading ? "not-allowed" : "allowed"}`}
              disabled={btnLoading}
            >
              {btnLoading ? "Please Wait..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
