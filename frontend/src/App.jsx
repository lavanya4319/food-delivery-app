import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import Payment from "./pages/Payment/Payment";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu/:id" element={<Menu />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer", "manager", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager", "restaurant"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant-dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager", "restaurant"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;