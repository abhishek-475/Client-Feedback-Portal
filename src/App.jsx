import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDash from "./pages/AdminDash";
import Feedback from "./pages/Feedback";
import ProtectRoute from "./components/ProtectRoute";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/submit" element={<ProtectRoute role="client"><Feedback /></ProtectRoute>} />
        <Route path="/admin" element={<ProtectRoute role="admin"><AdminDash /></ProtectRoute>} />
      </Routes>
    </>
  )
}

export default App;
