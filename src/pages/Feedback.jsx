import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message || !rating) {
      setError("All fields except image are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", message);
      formData.append("rating", rating);
      if (image) {
        if (!image.type.startsWith("image/")) {
          setError("Please upload a valid image.");
          return;
        }
        if (image.size > 5 * 1024 * 1024) {
          setError("Image size should not exceed 5MB.");
          return;
        }
        formData.append("image", image);
      }

      setIsSubmitting(true);

      await axios.post("/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Thank you! Feedback submitted successfully.");
      setMessage("");
      setRating(5);
      setImage(null);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Submit Feedback</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Message</label>
          <textarea
            className="form-control"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Rating</label>
          <select
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>{`${star} Star`}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Optional Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button
          className="btn btn-success w-100 d-flex justify-content-center align-items-center"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </button>

        {isSubmitting && (
          <div className="text-center mt-2 text-muted">
            Please wait while we process your feedback...
          </div>
        )}
      </form>
    </div>
  );
}

export default Feedback;
