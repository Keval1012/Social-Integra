import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthProvider';
import { Result } from 'antd';
import AppButton from './components/AppButton';
import Login from './pages/Login';
import Posts from './pages/Posts';
import Settings from './pages/Settings';

const MainRoutes = () => {
  const { user, currentRole, setIsMobile, setIsTablet, setIsDesktop } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= 481);
    setIsTablet(window.innerWidth <= 768);
    setIsDesktop(window.innerWidth >= 769);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  return (
    <>
      <div className='mainRouteDiv'>
        <Routes>
          <Route path='/' element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path='/login' element={user ? <Dashboard /> : <Login />} />
          <Route path='/dashboard' element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path='/share-post' element={<ProtectedRoute user={user}><Posts /></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute user={user}><Settings /></ProtectedRoute>} />

          <Route path='/unauthorized' element={
            <Result
              status="403"
              title="403"
              subTitle="Sorry, you are not authorized to access this page."
              extra={<AppButton type="dashed" onClick={() => navigate('/')} label='Back Home' />}
            />
          } />
        </Routes>
      </div>
      {/* <div>
        <AppFooter />
      </div> */}
    </>
  )
}

export default MainRoutes;