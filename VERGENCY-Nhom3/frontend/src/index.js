import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store.js'; 
import './index.css';

import App from './App';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; 
import AdminLayout from './components/AdminLayout';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage'; 

import HomePage from './pages/HomePage'; 
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage.js';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'; 
import UserProfileDetails from './pages/UserProfileDetails'; 
import MyOrdersPage from './pages/MyOrdersPage';
import AddressPage from './pages/AddressPage';
import ChangePasswordPage from './pages/ChangePasswordPage'; 

import DashboardPage from './pages/admin/DashboardPage';
import OrderListPage from './pages/admin/OrderListPage';
import ProductListAdminPage from './pages/admin/ProductListAdminPage'; 
import OrderDetailPage from './pages/admin/OrderDetailPage';
import UserListPage from './pages/admin/UserListPage'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />, 
    children: [
     
      { index: true, element: <HomePage /> },           
      { path: 'home', element: <HomePage /> },          
      { path: 'shop', element: <ProductListPage /> }, 
      { path: 'shop/:category', element: <ProductListPage /> },
      { path: 'product/:productId', element: <ProductDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:id', element: <BlogDetailPage /> }, 
      { path: 'account', element: <AuthPage /> }, 
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'cart', element: <CartPage /> },

      {
        element: <PrivateRoute />, 
        children: [
          { path: 'checkout', element: <CheckoutPage /> },

          {
            element: <ProfilePage />,
            children: [
                { path: 'profile', element: <UserProfileDetails /> }, 
                { path: 'my-orders', element: <MyOrdersPage /> },
                { path: 'addresses', element: <AddressPage /> },
                { path: 'change-password', element: <ChangePasswordPage /> },
            ]
          }
        ]
      },
      {
        path: 'admin',
        element: <AdminRoute />, 
        children: [
          {
            element: <AdminLayout />, 
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: 'dashboard', element: <DashboardPage /> }, 
              { path: 'orders', element: <OrderListPage /> },
              { path: 'order/:id', element: <OrderDetailPage /> },
              { path: 'products', element: <ProductListAdminPage /> }, 
              { path: 'customers', element: <UserListPage /> }, 
            ]
          }
        ]
      }
    ],
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);