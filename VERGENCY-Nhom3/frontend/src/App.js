// frontend/src/App.js

import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import Header from './components/Header';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import { Toaster } from 'react-hot-toast';
import ShopBanner from './components/ShopBanner';
import SvgSprite from './components/SvgSprite'; // <<== THÊM DÒNG NÀY

function App() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300); 
    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]); 

  const minimalLayoutRoutes = ['/checkout', '/admin'];
  const useMinimalLayout = minimalLayoutRoutes.some(route => location.pathname.startsWith(route));

  if (useMinimalLayout) {
    return (
        <>
            <SvgSprite /> {/* <<== THÊM DÒNG NÀY */}
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { borderRadius: '8px', background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.2rem 2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }, success: { duration: 3000, iconTheme: { primary: '#28a745', secondary: '#fff' } }, error: { duration: 4000, iconTheme: { primary: '#dc3545', secondary: '#fff' } },}} />
            <Outlet />
        </>
    );
  }

  return (
    <>
      <SvgSprite /> {/* <<== THÊM DÒNG NÀY */}
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { borderRadius: '8px', background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.2rem 2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }, success: { duration: 3000, iconTheme: { primary: '#28a745', secondary: '#fff' } }, error: { duration: 4000, iconTheme: { primary: '#dc3545', secondary: '#fff' } },}} />
      <Header />
      {location.pathname.startsWith('/shop') && <ShopBanner />}
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default App;