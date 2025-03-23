import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const MindHealthTest = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.manovaidya.com/api/get-banners"
        );
        if (response.data.success) {
          setBanners(response.data.data);
        } else {
          toast.error("Failed to load banners");
        }
      } catch (error) {
        toast.error("An error occurred while fetching banners");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `https://api.manovaidya.com/api/delete-banner/${id}`
        );
        setBanners(banners.filter((banner) => banner._id !== id));
        toast.success("Banner deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the banner");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Mental Health Self Test</h4>
        </div>
        <div className="links">
          <Link to="/add-mind-health-test" className="add-new">
            Add Test <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by name..."
          />
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Test Heading</th>
              <th scope="col">Test Points</th>
              <th scope="col">Background Color</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : banners.length > 0 ? (
              banners.map((banner, index) => (
                <tr key={banner._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={`https://api.manovaidya.com/${banner.bannerImage}`}
                      alt={banner.bannerTitle}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>{banner.bannerDate}</td>
                  <td>{banner.bannerTitle}</td>
                  <td>{banner.bannerDescription}</td>
                  <td>{banner.bannerDescription}</td>
                  <td>
                    <input
                      type="checkbox"
                      readOnly
                      checked={banner.showInHomePage}
                    />
                    {banner.showInHomePage ? "Yes" : "No"}
                  </td>
                  <td>
                    <Link to={`/edit-banner/${banner._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Test found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default MindHealthTest;
