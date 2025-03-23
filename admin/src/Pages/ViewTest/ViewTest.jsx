import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const ViewTest = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.manovaidya.com/api/get-tests"
        );
        if (response.data.success) {
          setTests(response.data.data);
        } else {
          toast.error("Failed to load tests");
        }
      } catch (error) {
        toast.error("An error occurred while fetching tests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
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
        await axios.delete(`https://api.manovaidya.com/api/delete-test/${id}`);
        setTests(tests.filter((test) => test._id !== id));
        toast.success("Test deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the test");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>View All Tests</h4>
        </div>
        <div className="links">
          <Link to="/add-test" className="add-new">
            Add Test <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Question</th>
              <th scope="col">Answer</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : tests.length > 0 ? (
              tests.map((test, index) => (
                <tr key={test._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{test.question}</td>
                  <td>{test.answer}</td>
                  <td>
                    <Link to={`/edit-test/${test._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Tests Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default ViewTest;
