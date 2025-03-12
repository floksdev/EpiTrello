import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectRoutes = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        return children;
    } catch (error) {
        return <Navigate to="/login" />;
    }
};

export default ProtectRoutes;
