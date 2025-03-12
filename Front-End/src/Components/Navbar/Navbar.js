import { FaQuestion, FaBell, FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import SiteLogo from '../../Assets/Logo-nav.png';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [createBoardError, setCreateBoardError] = useState("");
  const [allBoards, setAllBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const faqData = [
    { title: "Titre 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod..." },
    { title: "Titre 2", content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim..." },
    { title: "Titre 3", content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat..." }
  ];
  const [openFaqItems, setOpenFaqItems] = useState(faqData.map(() => false));
  const toggleFaqItem = (index) => {
    setOpenFaqItems(prev => {
      const newItems = [...prev];
      newItems[index] = !newItems[index];
      return newItems;
    });
  };

  const token = localStorage.getItem('token');
  
  const getUserEmailFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.email;
    }
    return null;
  };

  const getUserIDFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    }
    return null;
  };

  const userEmail = getUserEmailFromToken();
  const userID = getUserIDFromToken();
  const userName = userEmail ? userEmail.split('@')[0] : '';
  const userLetterName = userName.charAt(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToAccount = () => {
    navigate('/mon-compte');
  };

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
      setAllBoards(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchBoards();
    }
  }, [userID]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const results = allBoards.filter(board => {
        const lowerName = board.name.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase();
        if (lowerName.includes(lowerSearch)) return true;
        const distance = levenshtein(lowerSearch, lowerName);
        return distance <= 3; 
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allBoards]);

  const levenshtein = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const handleCreateBoard = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newBoardName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Échec de la création du board');
      console.log("Board created successfully", data);
      setIsCreateBoardOpen(false);
      setNewBoardName("");
      fetchBoards();
      navigate(`/board/${data._id}`);
    } catch (e) {
      setCreateBoardError(e.message);
      console.error(e);
    }
  };

  const fetchActivityLogs = async (boardID) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards/${boardID}/activity`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la récupération des logs");
      setActivityLogs(data);
    } catch (e) {
      console.error(e);
      setActivityLogs([]);
    }
  };

  const handleBellClick = () => {
    const path = location.pathname;
    if (path.includes("/board/")) {
      const segments = path.split("/");
      const boardID = segments[2];
      fetchActivityLogs(boardID);
    } else {
      setActivityLogs([]);
    }
    setIsLogsOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left" onClick={() => navigate('/board')}>
          <img
            src={SiteLogo}
            alt="EpiTrello Logo"
            className="logo-nav-img"
          />
          EpiTrello
        </div>

        <ul className="navbar-center">
          <Link to="/board" className="nav-link">
            <li>Espaces de travail</li>
          </Link>
          <Link to="/recent" className="nav-link">
            <li>Récent</li>
          </Link>
          <Link to="/favoris" className="nav-link">
            <li>Favoris</li>
          </Link>
          <li>
            <button 
              className="create-button" 
              onClick={() => setIsCreateBoardOpen(true)}
            >
              Créer
            </button>
          </li>
        </ul>

        <div className="navbar-right">
          <FaSearch className="fa-icon" />
          <div style={{ position: 'relative' }}>
            <input 
              className="searchbar" 
              placeholder="Rechercher" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(board => (
                  <div 
                    key={board._id} 
                    className="search-result-item"
                    onClick={() => {
                      navigate(`/board/${board._id}`);
                      setSearchTerm("");
                    }}
                  >
                    {board.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <FaBell className="fa-icon" onClick={handleBellClick} />
          <FaQuestion className="fa-icon" onClick={() => setIsFaqOpen(true)} />
          <div className="circle-avatar" onClick={toggleMenu}>
            {userLetterName}
          </div>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={goToAccount} className="account-button">
                Mon compte
              </button>
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>

      {isCreateBoardOpen && (
        <div className="create-board-modal">
          <div className="modal-content">
            <h2>Créer un nouveau tableau</h2>
            <input
              type="text"
              placeholder="Nom du tableau"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            {createBoardError && <p className="error">{createBoardError}</p>}
            <div className="modal-buttons">
              <button onClick={handleCreateBoard}>Créer</button>
              <button onClick={() => setIsCreateBoardOpen(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {isFaqOpen && (
        <div className="faq-modal">
          <div className="faq-modal-content">
            <h2>FAQ</h2>
            {faqData.map((item, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-title" onClick={() => toggleFaqItem(index)}>
                  {item.title} {openFaqItems[index] ? '↑' : '↓'}
                </div>
                {openFaqItems[index] && (
                  <div className="faq-content">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
            <button className="faq-close-button" onClick={() => setIsFaqOpen(false)}>Fermer</button>
          </div>
        </div>
      )}

      {isLogsOpen && (
        <div className="logs-modal">
          <div className="logs-modal-content">
            <h2>Activité</h2>
            {activityLogs.length > 0 ? (
              activityLogs.map(log => (
                <div key={log._id} className="logs-item">
                  <p>
                    <span className="timestamp">{new Date(log.createdAt).toLocaleString()}</span>
                    <strong>{log.userEmail}</strong> {log.action} {log.details && ` ${log.details}`}
                    <br />
                  </p>
                </div>
              ))
            ) : (
              <p>
                {location.pathname.includes("/board/") 
                  ? "Aucune activité enregistrée pour ce tableau."
                  : "Aucun board actif pour afficher l'activité."}
              </p>
            )}
            <button className="faq-close-button" onClick={() => setIsLogsOpen(false)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
