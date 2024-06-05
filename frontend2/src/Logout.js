import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spacer from './Spacer';

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
        navigate('/login');
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
                        <p><h1>Are you sure you want to logout?</h1></p>
                        <Spacer size={30} />
                        <button class="button2" onClick={handleConfirm} style={{ marginRight: '10px' }}>Yes</button>
                        <button class="button2" onClick={handleCancel}>No</button>
                    </>
                ) : (
                    <>
                        <p><h1>Logging out...</h1></p>
                        {handleLogout()}
                    </>
                )
            ) : (
                <>
                    <p><h1>You are not logged in.</h1></p>
                    <button onClick={() => navigate('/login')}>Login</button>
                </>
            )}
        </div>
    );
};

export default Logout;
