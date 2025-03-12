import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLogo from '../Assets/Logo.png';
import { jwtDecode } from 'jwt-decode';
import './css/Board.css';
import { FaRegTrashAlt } from "react-icons/fa";

const CreateBoard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem('token');

  const getUserIDFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    }
    return null;
  };

  const userID = getUserIDFromToken();
  const pageSize = 3;

  const HandleCreateBoard = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Échec de la création du board');
      }
      console.log('Board créé avec succès', data);
      GetBoards();
    } catch (e) {
      setError(e.message);
      console.error('Erreur', e);
    }
  };

  const GetBoards = async () => {
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
      setBoards(data);
    } catch (e) {
      console.error(e.message);
      setError('Erreur lors de la récupération des boards');
    }
  };

  const HandleArchiveBoard = async (BoardID) => {
    try {
      await fetch(`http://localhost:3001/users/${userID}/Boards/${BoardID}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archive: true }),
      });
      GetBoards();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (userID) GetBoards();
  }, [userID]);

  const nonArchivedBoards = boards.filter(board => !board.archive);

  const totalPages = Math.ceil(nonArchivedBoards.length / pageSize);

  const getVisibleBoards = () => {
    const start = (currentPage - 1) * pageSize;
    return nonArchivedBoards.slice(start, start + pageSize);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleRedirection = (BoardID, BoardName) => {
    navigate(`/board/${BoardID}`, { state: { boardName: BoardName } });
    console.log("ID du board sélectionné :", BoardID);
  };

  return (
    <div className="main-div">
      <img src={SiteLogo} alt="EpiTrello Logo" className="logo" />
      <div className="title">Votre espace de travail</div>

      {boards.length > 0 ? (
        <div className="boards-container">
          <div className="boards-list">
            {getVisibleBoards().map(board => (
              <div
                className="board"
                key={board._id}
                onClick={() => handleRedirection(board._id, board.name)}
              >
                {board.name}
                <button 
                  className="archive-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    HandleArchiveBoard(board._id);
                  }}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Suivant
            </button>
          </div>
        </div>
      ) : (
        <p>Récupération des boards...</p>
      )}

      <input
        className="input-board"
        type="text"
        name="name"
        placeholder="+ | Nouveau tableau"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="button-submit" type="submit" onClick={HandleCreateBoard}>
        Ajouter
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateBoard;
