import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLogo from '../Assets/Logo.png';
import './css/Account.css';
import { jwtDecode } from 'jwt-decode';

const MonCompte = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const token = localStorage.getItem('token');
  const getUserIDFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    }
    return null;
  };

  const userID = getUserIDFromToken();

  const getUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de la récupération des données utilisateur");
      setUserData(data);
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  };

  useEffect(() => {
    if (userID) {
      getUserData();
    }
  }, [userID]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/password`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la mise à jour du mot de passe");
      
      setPasswordMessage("Mot de passe mis à jour avec succès.");
      setEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      getUserData();
    } catch (e) {
      setPasswordMessage(e.message);
      console.error(e);
    }
  };

  return (
    <div className="main-div">
      <img 
        src={SiteLogo} 
        alt="Logo" 
        className="logo" 
        onClick={() => navigate('/board')}
      />
      <div className="title">Mon Compte</div>
  
      {error && <p className="error">{error}</p>}
      {userData ? (
        <>
          <div className="user-info">
            {userData.profilePicture ? (
              <img src={userData.profilePicture} alt="Profil" className="profile-picture" />
            ) : (
              <div className="default-avatar">
                {userData.email.charAt(0).toUpperCase()}
              </div>
            )}
            <p className='user-info-after'><span className='bold-text'>Email :</span> {userData.email}</p>
            <div className="password-section">
              {!editingPassword ? (
                <>
                  <p className='user-info-after'><span className='bold-text'>Mot de passe : {"●".repeat(8)} </span><button onClick={() => setEditingPassword(true)} className="edit-btn">Modifier</button></p>
                  {/* <span className="password-masked"></span> */}
                  
                </>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="password-form">
                  <div>
                    <label>Mot de passe actuel :</label>
                    <input 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Nouveau mot de passe :</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="save-btn">Sauvegarder</button>
                  <button type="button" onClick={() => setEditingPassword(false)} className="cancel-btn">Annuler</button>
                </form>
              )}
              {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            </div>
            
            <p className='user-info-after'><span className='bold-text'>Permissions :</span>  {userData.permissions === 0 ? 'simple utilisateur' : 'admin'}</p>
          </div>
  
          {userData.boards && userData.boards.length > 0 && (
            <div className="boards-section">
              <h2>Vos Boards</h2>
              <ul className="boards-list">
                {userData.boards.map((board, index) => (
                  <li key={index}>
                    {board.name ? board.name : board}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );  
};

export default MonCompte;
