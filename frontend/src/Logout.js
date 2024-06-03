import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        setIsLoggedIn(!!token && !!username);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleConfirm = () => {
        setConfirmLogout(true);
    };

    const handleCancel = () => {
        setConfirmLogout(false);
        navigate('/profile');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {isLoggedIn ? (
                !confirmLogout ? (
                    <>
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleConfirm} style={{ marginRight: '10px' }}>Yes</button>
                        <button onClick={handleCancel}>No</button>
                    </>
                ) : (
                    <>
                        <p>Logging out...</p>
                        {handleLogout()}
                    </>
                )
            ) : (
                <>
                    <p>You are not logged in.</p>
                    <button onClick={() => navigate('/')}>Login</button>
                </>
            )}
        </div>
    );
};

export default Logout;
