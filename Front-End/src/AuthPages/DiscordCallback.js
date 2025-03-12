import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DiscordCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            handleDiscordSuccess(code);
        } else {
            console.error('Aucun code d\'autorisation reçu.');
            navigate('/login');
        }
    }, [location]);

    const handleDiscordSuccess = (code) => {
        fetch('http://localhost:3001/auth/discord', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Connexion réussie via Discord ! JWT:', data.token);
                navigate('/board');
            } else {
                console.error('Erreur lors de la connexion avec Discord');
                navigate('/login');
            }
        })
        .catch((error) => {
            console.error('Erreur Discord OAuth:', error);
            navigate('/login');
        });
    };

    return (
        <div>Redirection vers le serveur Discord...</div>
    );
};

export default DiscordCallback;
