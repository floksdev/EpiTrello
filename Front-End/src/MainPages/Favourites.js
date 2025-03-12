import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLogo from '../Assets/Logo.png';
import './css/Favourites.css';
import { jwtDecode } from 'jwt-decode';

const Favoris = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const getUserIDFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    }
    return null;
  };

  const userID = getUserIDFromToken();

  const getBoards = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de la récupération des boards");
      
      const favoris = data.filter(board => board.favorite === true);
      setBoards(favoris);
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  };

  useEffect(() => {
    if (userID) {
      getBoards();
    }
  }, [userID]);

  return (
    <div className="main-div">
      <img 
        src={SiteLogo} 
        alt="Logo" 
        className="logo" 
        onClick={() => navigate('/board')}
      />
      <div className="title">Favoris</div>
      {error && <p className="error">{error}</p>}
      {boards.length > 0 ? (
        <div className="boards-section">
          <ul className="boards-list">
            {boards.map((board, index) => (
              <li key={index} className="board">
                {board.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Aucun board favori trouvé.</p>
      )}
    </div>
  );
};

export default Favoris;
