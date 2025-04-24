import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", credentials);
      const { token, user } = res.data;
      // console.log("Login Response:", res.data);


      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/submit");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div 
      className="w-100 d-flex justify-content-center align-items-center" 
      style={{ height: "100vh" }} 
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
