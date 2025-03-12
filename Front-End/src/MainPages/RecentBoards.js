import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLogo from '../Assets/Logo.png';
import './css/RecentBoards.css';
import { jwtDecode } from 'jwt-decode';

const RecentBoards = () => {
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

  const fetchBoards = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la récupération des boards");

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentBoards = data
        .filter(board => new Date(board.updatedAt) >= sevenDaysAgo)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        console.log(data);
      setBoards(recentBoards);
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchBoards();
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
      <div className="title">Tableaux récents</div>
      {error && <p className="error">{error}</p>}
      <div className="boards-section">
        {boards.length > 0 ? (
          <ul className="boards-list">
            {boards.map((board) => (
              <li 
                key={board._id} 
                className="board" 
                onClick={() => navigate(`/board/${board._id}`)}
              >
                {board.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun tableau récent trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default RecentBoards;
