import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';

import PrivateRoute from './components/PrivateRoute';

import AdminLayout from './components/AdminLayout';
import ProfilePage from './pages/ProfilePage';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import CheckoutPage from './pages/CheckoutPage';
import UserProfileDetails from './pages/UserProfileDetails';
import MyOrdersPage from './pages/MyOrdersPage';
import AddressPage from './pages/AddressPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductListAdminPage from './pages/admin/ProductListAdminPage';
import ProductCreatePage from './pages/admin/ProductCreatePage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'shop', element: <ProductListPage /> },
            { path: 'product/:id', element: <ProductDetailPage /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'login', element: <AuthPage /> },

            {
                path: 'admin',
                element: <PrivateRoute adminOnly={true}><AdminLayout /></PrivateRoute>,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'products', element: <ProductListAdminPage /> },
                    { path: 'products/create', element: <ProductCreatePage /> },
                    { path: 'product/:id/edit', element: <ProductEditPage /> },
                    { path: 'orders', element: <OrderListPage /> },
                    { path: 'customers', element: <UserListPage /> }, 
                ],
            },

            {
                element: <PrivateRoute />, 
                children: [
                    {
                        element: <ProfilePage />,
                        children: [
                            { path: 'profile', element: <UserProfileDetails /> },
                            { path: 'my-orders', element: <MyOrdersPage /> },
                            { path: 'addresses', element: <AddressPage /> },
                            { path: 'change-password', element: <ChangePasswordPage /> },
                        ]
                    },
                    
                    { path: 'checkout', element: <CheckoutPage /> },
                ]
            },
        ],
    },
]);

const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;