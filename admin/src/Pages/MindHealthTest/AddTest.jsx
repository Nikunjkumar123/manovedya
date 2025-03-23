import axios from "axios";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    addHeaderTitle: "",
    addHeaderDesc: "",
    addSubDesc: "",
    questions: [{ question: "", answer: "" }],
  });

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle dynamic question and answer input change
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][name] = value;
    setFormData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  // Add new question and answer fields
  const addQuestionField = () => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, { question: "", answer: "" }],
    }));
  };

  // Remove a question field
  const removeQuestionField = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.manovaidya.com/api/create-mind-health-test",
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
          <h4>Add Test</h4>
        </div>
        <div className="links">
          <Link to="/view-test" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Header Title */}
          <div className="col-md-4">
            <label htmlFor="addHeaderTitle" className="form-label">
              Add Header Title
            </label>
            <input
              type="text"
              name="addHeaderTitle"
              className="form-control"
              id="addHeaderTitle"
              value={formData.addHeaderTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Header Description */}
          <div className="col-md-4">
            <label htmlFor="addHeaderDesc" className="form-label">
              Add Header Description
            </label>
            <input
              type="text"
              name="addHeaderDesc"
              className="form-control"
              id="addHeaderDesc"
              value={formData.addHeaderDesc}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sub Description */}
          <div className="col-md-4">
            <label htmlFor="addSubDesc" className="form-label">
              Add Sub Description
            </label>
            <input
              type="text"
              name="addSubDesc"
              className="form-control"
              id="addSubDesc"
              value={formData.addSubDesc}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <div className="head">
              <h4>Add Test Questions & Answers</h4>
            </div>
          </div>

          {/* Dynamic Questions & Answers */}
          {formData.questions.map((item, index) => (
            <div key={index} className="row align-items-center">
              <div className="col-md-4">
                <label htmlFor={`question-${index}`} className="form-label">
                  Add Question
                </label>
                <input
                  type="text"
                  name="question"
                  className="form-control"
                  id={`question-${index}`}
                  value={item.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor={`answer-${index}`} className="form-label">
                  Add Answer
                </label>
                <input
                  type="text"
                  name="answer"
                  className="form-control"
                  id={`answer-${index}`}
                  value={item.answer}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="form-label">
                  Add More Questions
                </label>
                <br />
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => removeQuestionField(index)}
                  >
                    Remove
                  </button>
                )}
                {index === formData.questions.length - 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addQuestionField}
                  >
                    Add More
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "btn-secondary" : "btn-success"}`}
            >
              {isLoading ? "Please Wait..." : "Add Test"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTest;
