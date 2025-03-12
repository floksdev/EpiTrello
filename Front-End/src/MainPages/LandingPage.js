import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListImg from '../Assets/MainLists.png';
import SiteLogo from '../Assets/Logo.png';
import ElipseImg from '../Assets/MainElipse.png';
import './css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="main-div">
      <nav className="navbar1">
        <div className="navbar1-left">
          <img className="site-logo" src={SiteLogo} alt="Site Logo" />
        </div>
        <div className="navbar1-center">
          <ul className="nav1-menu">
            <li>Caractéristiques</li>
            <li>Solutions</li>
            <li>Plans</li>
            <li>Tarification</li>
          </ul>
        </div>
        <div className="navbar1-right">
          <div className="auth-links">
            <a href="/login">Se connecter</a>
            <a href="/register">S'inscrire</a>
          </div>
        </div>
      </nav>

      <header className="top-header">
        Organisons-nous ensemble 🤝
      </header>

      <div className="content-wrapper">
        <div className="top-content">
          <div className="text-container">
            <div className="headline">
              EpiTrello rassemble toutes vos tâches, vos coéquipiers et vos outils
            </div>
            <div className="subheadline">
              Gardez tout au même endroit, même si votre équipe ne l'est pas.
            </div>
            <div className="signup-section">
              <input type="email" placeholder="Votre email" className="signup-input" />
              <button onClick={() => navigate('/register')} className="signup-button">
                S'inscrire
              </button>
            </div>
          </div>
          <div className="list-img-container">
            <img src={ListImg} alt="List" className="list-img" />
          </div>
        </div>
      </div>

      <div className="ellipse-container">
        <img src={ElipseImg} alt="Ellipse" className="ellipse-img" />
      </div>
    </div>
  );
};

export default LandingPage;
