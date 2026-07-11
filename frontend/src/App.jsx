import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import Payment from "./pages/Payment/Payment";
import RestaurantDashboard from "./pages/RestaurantDashboard/RestaurantDashboard";
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

        <Route path="/cart" element={<Cart />} />

        <Route path="/payment" element={<Payment />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/restaurant-dashboard"
          element={<RestaurantDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
      </Routes>
    </>
  );
}

export default App;