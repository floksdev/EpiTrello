import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import SiteLogo from '../Assets/Logo.png';
import GoogleIcon from '../Assets/AuthPages/google_icon.png';
import MicrosoftIcon from '../Assets/AuthPages/microsoft_icon.png';
import AppleIcon from '../Assets/AuthPages/apple_icon.png';
import SlackIcon from '../Assets/AuthPages/slack_icon.png';
import { FaDiscord } from "react-icons/fa";
import './css/Auth.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { email, password };

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log('Connexion réussie ! JWT:', data.token);

                navigate('/board');
            } else {
                setErrorMessage(data.message || 'Erreur lors de la connexion');
            }
        } catch (error) {
            console.log('Erreur lors de l\'envoi des données', error);
            setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
    
        fetch('http://localhost:3001/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credentialResponse.credential }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la vérification Google');
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    console.log('Connexion réussie via Google ! JWT:', data.token);
    
                    navigate('/board');
                } else {
                    setErrorMessage(data.message || 'Erreur lors de la connexion avec Google');
                }
            })
            .catch((error) => {
                console.error('Erreur Google OAuth:', error);
                setErrorMessage('Erreur lors de la connexion avec Google');
            });
    };
    

    const handleGoogleFailure = (error) => {
        console.log('Google Login Failure:', error);
        setErrorMessage('Échec de la connexion avec Google');
    };

    const handleDiscordSuccess = (response) => {
        const { code } = response;

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
                    setErrorMessage(data.message || 'Erreur lors de la connexion avec Discord');
                }
            })
            .catch((error) => {
                console.error('Erreur Discord OAuth:', error);
                setErrorMessage('Erreur lors de la connexion avec Discord');
            });
    };

    const handleDiscordFailure = (error) => {
        console.log('Discord Login Failure:', error);
        setErrorMessage('Échec de la connexion avec Discord');
    };

    return (
        <GoogleOAuthProvider clientId="412843791422-do111od6262966ikq5ftcdp89fcun6sl.apps.googleusercontent.com">
            <div className="main-div">
                <div className="form-container">
                    <img src={SiteLogo} alt="EpiTrello Logo" className="logo" />
                    <div className="title-area">
                        <div className="title">Connectez-vous pour continuer</div>
                    </div>
                    <div className="inputs-area">
                        <input
                            type="email"
                            placeholder="Saisir l'adresse email"
                            className="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Saisir le mot de passe"
                            className="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="submit-area">
                        <button className="button" onClick={handleSubmit}>Se connecter</button>
                    </div>
                    <div className="social-area">
                        <div className="or-divider">Ou continuez avec</div>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                            render={(renderProps) => (
                                <button
                                className="social-button google"
                                onClick={renderProps.onClick}
                                >
                                <img src={GoogleIcon} alt="Google Logo" className="google_icon" />
                                <span>Google</span>
                                </button>
                            )}
                        />
                        <button
                            className="social-button discord"
                            onClick={() =>
                                window.location.href = `https://discord.com/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_DISCORD_REDIRECT_URI}&scope=identify+email`
                            }
                        >
                            <FaDiscord className="discord-icon" />
                            <span className="social-button-text">Se connecter avec Discord</span>
                            <span className="dummy-element"></span>
                        </button>
                    </div>
                    <div className="footer">
                        <p>Un problème ? <a href="/register">Créer un compte</a></p>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginForm;
