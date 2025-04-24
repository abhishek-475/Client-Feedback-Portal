import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable submit button during submission
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
        // Validate image size and type
        if (!image.type.startsWith("image/")) {
          setError("Please upload a valid image.");
          return;
        }
        if (image.size > 5 * 1024 * 1024) { // Limit image size to 5MB
          setError("Image size should not exceed 5MB.");
          return;
        }
        formData.append("image", image);
      }

      setIsSubmitting(true); // Disable submit button

      await axios.post("/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Feedback submitted successfully!");
      setMessage("");
      setRating(5);
      setImage(null);

      setTimeout(() => navigate("/"), 2000); // Redirect after submission
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false); // Re-enable submit button after the request is completed
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
          className="btn btn-success w-100" 
          type="submit" 
          disabled={isSubmitting} // Disable the button during submission
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;
