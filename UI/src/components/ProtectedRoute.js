import { message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ProtectedRoute = ({ user, module, children }) => {
    const { setIsAuth } = useContext(AuthContext)??{};
    const [isModuleGranted, setIsModuleGranted] = useState(true);
    const token = localStorage.getItem('token');

    if (!token) {
        setIsAuth(false);
        window.location.href = '/login';
        message.error('Session Expired, Please Login Again.');
    }
    
    // if (!isModuleGranted) {
    //     return <Navigate to='/unauthorized' />
    // }

    return token && user ?
    // return localStorage.getItem('token') ?
        children
        : 
        <Navigate to='/login' />
        // children
}

export default ProtectedRoute;