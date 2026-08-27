import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Account from "./pages/Account.jsx";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute.jsx";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import ProductList from "./admin/ProductList.jsx";
import ProductForm from "./admin/ProductForm.jsx";
import OrdersList from "./admin/OrdersList.jsx";
import OrderDetail from "./admin/OrderDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <Routes>
        {/* Storefront */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route
                    path="/account"
                    element={
                      <CustomerProtectedRoute>
                        <Account />
                      </CustomerProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <CustomerProtectedRoute>
                        <Checkout />
                      </CustomerProtectedRoute>
                    }
                  />
                  <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
        </Route>
      </Routes>
    </div>
  );
}
