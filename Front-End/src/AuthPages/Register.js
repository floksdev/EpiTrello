import React, { useState, useEffect } from 'react';
import SiteLogo from '../Assets/Logo.png';
import GoogleIcon from '../Assets/AuthPages/google_icon.png';
import MicrosoftIcon from '../Assets/AuthPages/microsoft_icon.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import AppleIcon from '../Assets/AuthPages/apple_icon.png';
import SlackIcon from '../Assets/AuthPages/slack_icon.png';
import { FaDiscord } from 'react-icons/fa';
import './css/Auth.css';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { email, password };

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok){
                setSuccessMessage(data.message);
            } else
                setErrorMessage(data.message);

        } catch (error) {
            console.log('Erreur lors de l\'envoi des données', error);
        }
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);
    
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

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

    return (
        <GoogleOAuthProvider clientId="412843791422-do111od6262966ikq5ftcdp89fcun6sl.apps.googleusercontent.com">
            <div className="main-div">
                <div className="form-container">
                    <img src={SiteLogo} alt="EpiTrello Logo" className="logo" />
                    <div className="title-area">
                        <div className="title">Inscrivez-vous pour continuer</div>
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
                        {errorMessage && (
                            <div className='error-messages'>
                                ❗{errorMessage}
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className='success-messages'>
                                ✅ {successMessage}
                            </div>
                        )}
                    </div>
                    <div className="submit-area">
                        <button className="button" onClick={handleSubmit}>S'inscrire</button>
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
                        <p>Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></p>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
            
    );
};

export default RegisterForm;
