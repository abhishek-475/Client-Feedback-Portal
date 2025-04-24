import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function AdminDash() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [commentStates, setCommentStates] = useState({});
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, [filterRating, sortOrder]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/feedback?rating=${filterRating}&sort=${sortOrder}`);
      setFeedbacks(response.data);

      // Initialize comment states
      const commentMap = {};
      response.data.forEach(fb => {
        commentMap[fb._id] = fb.adminComment || "";
      });
      setCommentStates(commentMap);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to load feedbacks.");
    }
  };

  const handleResponse = async (feedbackId) => {
    const response = commentStates[feedbackId];
    try {
      await axios.put(`/feedback/${feedbackId}/comment`, { comment: response });
      fetchFeedbacks(); // refresh after comment
    } catch (err) {
      setError("Failed to update response.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Admin Dashboard</span>
          <div className="ml-auto">
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="mb-4">Manage Feedback</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Filter by Rating</label>
            <select
              className="form-control"
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
            >
              <option value={0}>All Ratings</option>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {`${star} Star`}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>Sort by Date</label>
            <select
              className="form-control"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div>Loading feedbacks...</div>
        ) : (
          <div className="list-group">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="list-group-item">
                <h5>{`Rating: ${feedback.rating} Stars`}</h5>
                <p>{feedback.text}</p>

                {feedback.imageUrl && (
                  <img
                    src={`/${feedback.imageUrl}`}
                    alt="feedback"
                    className="img-fluid mb-2"
                  />
                )}

                <div className="mt-3">
                  <h6>Admin Comment</h6>
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    value={commentStates[feedback._id] || ""}
                    onChange={(e) =>
                      setCommentStates({
                        ...commentStates,
                        [feedback._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleResponse(feedback._id)}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDash;
