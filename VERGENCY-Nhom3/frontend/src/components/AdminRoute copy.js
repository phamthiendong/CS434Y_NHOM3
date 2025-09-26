import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner'; 
const AdminRoute = () => {
  const { userInfo, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Spinner />;
  }

  if (userInfo && userInfo.isAdmin) {
    return <Outlet />;
  } 
  
  else {
    return <Navigate to="/account" replace />;
  }
};

export default AdminRoute;