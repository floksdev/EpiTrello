import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./css/inBoard.css";
import { jwtDecode } from "jwt-decode";
import { FaRegTrashAlt } from "react-icons/fa";


const HandleList = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const inputRef = useRef(null);
  
  const [name, setName] = useState("");
  const [boardName, setBoardName] = useState("");
  const [boardFavorite, setBoardFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [cardTitles, setCardTitles] = useState({});
  const [cardLabels, setCardLabels] = useState([]);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [addingCardListId, setAddingCardListId] = useState(null);
  const [isDraggingList, setIsDraggingList] = useState(false);
  const [listName, setListName] = useState("");
  const [activeListId, setActiveListId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [isCreateLabelClicked, setIsCreateLabelClicked] = useState(false);
  const [isCardArchived, setIsCardArchived] = useState(false);
  const [isListArchived, setIsListArchived] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [boardMembers, setBoardMembers] = useState([]);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [activeCardListId, setActiveCardListId] = useState(null);
  const [assignedUserId, setAssignedUserId] = useState("");

  const token = localStorage.getItem("token");
  const { boardID } = useParams();

  const getUserIDFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    }
    return null;
  };

  const userID = getUserIDFromToken();

  const countLinks = (text) => {
    if (!text) return 0;
    const regex = /https?:\/\/[^\s]+/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const GetBoardName = async () => {
    try {
      const response = await fetch(`http://localhost:3001/board-infos/${boardID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la récupération du nom du board");

      setBoardName(data.name);
      if (typeof data.favorite !== "undefined") {
        setBoardFavorite(data.favorite);
      }
      if (data.members && data.members.length > 0) {
        GetBoardMembers(data.members);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const GetBoardMembers = async (members) => {
    try {
      const response = await fetch(`http://localhost:3001/board-infos/getMembers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ members }),
      });
      const membersData = await response.json();
      if (!response.ok) throw new Error(membersData.message || "Impossible de récupérer les membres");
      setBoardMembers(membersData);
    } catch (e) {
      console.error("Erreur lors de la récupération des membres :", e.message);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards/${boardID}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite: !boardFavorite }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la mise à jour du favori");
      setBoardFavorite(data.favorite);
    } catch (e) {
      setError(e.message);
    }
  };

  const HandleAddMember = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}/Boards/${boardID}/addMember`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newMemberEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Impossible d'ajouter le membre");
      setNewMemberEmail("");
      setShowAddMemberForm(false);
      setError(null);
      GetBoardName();
    } catch (e) {
      setError(e.message);
    }
  };

  const HandleCreateList = async (name, skipGetLists = false) => {
    try {
      const position = lists.length + 1;
      const response = await fetch(`http://localhost:3001/board/${boardID}/lists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, position }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la création de la liste");
      setIsAddingList(false);
      if (!skipGetLists) {
        GetLists();
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const GetLists = async () => {
    try {
      const response = await fetch(`http://localhost:3001/board/${boardID}/lists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la récupération des listes");
      if (data.length === 0) {
        const defaultLists = ["À faire", "En cours", "Terminées"];
        for (let i = 0; i < defaultLists.length; i++) {
          await HandleCreateList(defaultLists[i]);
        }
        GetLists();
      } else {
        setLists(data);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const HandleCreateCard = async (listId) => {
    try {
      const targetList = lists.find((list) => list._id === listId);
      const position = targetList.cards.length + 1;
      const response = await fetch(`http://localhost:3001/lists/${listId}/cards`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: cardTitles[listId] || "", position }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la création de la carte");
      setCardTitles((prev) => ({ ...prev, [listId]: "" }));
      setAddingCardListId(null);
      GetLists();
    } catch (e) {
      setError(e.message);
    }
  };

  const HandleCardDrop = async (cardId, fromListId, toListId, targetIndex = null) => {
    try {
      const updatedLists = [...lists];
      const sourceList = updatedLists.find((list) => list._id === fromListId);
      const targetList = updatedLists.find((list) => list._id === toListId);
      const cardToMove = sourceList.cards.find((card) => card._id === cardId);
      if (cardToMove) {
        sourceList.cards = sourceList.cards.filter((card) => card._id !== cardId);
        if (targetIndex === null) {
          targetList.cards.push(cardToMove);
        } else {
          targetList.cards.splice(targetIndex, 0, cardToMove);
        }
        targetList.cards.forEach((card, index) => {
          card.position = index + 1;
        });
        sourceList.cards.forEach((card, index) => {
          card.position = index + 1;
        });
        setLists(updatedLists);

        await fetch(`http://localhost:3001/lists/${fromListId}/cards/${cardId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            list: toListId,
            position: targetIndex !== null ? targetIndex + 1 : targetList.cards.length,
          }),
        });

        await Promise.all([
          ...sourceList.cards.map((card, index) =>
            fetch(`http://localhost:3001/lists/${fromListId}/cards/${card._id}`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ position: index + 1 }),
            })
          ),
          ...targetList.cards.map((card, index) =>
            fetch(`http://localhost:3001/lists/${toListId}/cards/${card._id}`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ position: index + 1 }),
            })
          ),
        ]);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const HandleListDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!isDraggingList) return;
    const listId = e.dataTransfer.getData("listId");
    const draggedListIndex = lists.findIndex((list) => list._id === listId);
    if (draggedListIndex === -1) return;
    const updatedLists = [...lists];
    const [draggedList] = updatedLists.splice(draggedListIndex, 1);
    updatedLists.splice(targetIndex, 0, draggedList);
    setLists(updatedLists);
    saveListPositions(updatedLists);
  };

  const saveListPositions = async (updatedLists) => {
    try {
      for (const [index, list] of updatedLists.entries()) {
        await fetch(`http://localhost:3001/board/${boardID}/lists/${list._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ position: index }),
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDragStart = (e, type, id, fromListId = null) => {
    e.stopPropagation();
    if (type === "card") {
      setIsDraggingList(false);
      e.dataTransfer.setData("type", "card");
      e.dataTransfer.setData("cardId", id);
      e.dataTransfer.setData("fromListId", fromListId);
    } else if (type === "list") {
      setIsDraggingList(true);
      e.dataTransfer.setData("type", "list");
      e.dataTransfer.setData("listId", id);
    }
  };

  const handleDrop = (e, toListId, targetIndex = null) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (type === "card") {
      const cardId = e.dataTransfer.getData("cardId");
      const fromListId = e.dataTransfer.getData("fromListId");
      HandleCardDrop(cardId, fromListId, toListId, targetIndex);
    } else if (type === "list" && isDraggingList) {
      HandleListDrop(e, targetIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const HandleRenameList = async (ReplacedListName, listId) => {
    try {
      await fetch(`http://localhost:3001/board/${boardID}/lists/${listId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: ReplacedListName }),
      });
      GetLists();
    } catch (error) {
      setError(error.message);
    }
  };

  const HandlePatchCardPannel = async (listId, cardId, title, description, labels) => {
    try {
      await fetch(`http://localhost:3001/lists/${listId}/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, labels }),
      });
      GetLists();
    } catch (error) {
      setError(error.message);
    }
  };

  const HandleArchiveCard = async (listId, cardId, archive) => {
    try {
      await fetch(`http://localhost:3001/lists/${listId}/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archive }),
      });
      GetLists();
    } catch (error) {
      setError(error.message);
    }
  };

  const HandleArchiveList = async (listId, archive) => {
    try {
      await fetch(`http://localhost:3001/board/${boardID}/lists/${listId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archive }),
      });
      GetLists();
    } catch (error) {
      setError(error.message);
    }
  };

  const HandleAssignUser = async (listId, cardId, userId) => {
    try {
      const response = await fetch(`http://localhost:3001/lists/${listId}/cards/${cardId}/assign`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de l'assignation");
      GetLists();
    } catch (e) {
      setError(e.message);
    }
  };

  const getLabelColor = (label) => {
    const colors = ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0', '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563'];
    const index = Math.abs(label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  useEffect(() => {
    if (userID && boardID) {
      GetLists();
      GetBoardName();
    }
  }, [userID, boardID]);

  useEffect(() => {
    if (activeListId && inputRef.current) {
      const activeList = lists.find((list) => list._id === activeListId);
      if (activeList) {
        inputRef.current.select();
      }
    }
  }, [activeListId, lists]);

  return (
    <div className="main-div-on-board">
      <div className="options-dropdown-container">
        <button className="options-btn" onClick={() => setIsOptionsOpen(!isOptionsOpen)}>
          Options
        </button>
        {isOptionsOpen && (
          <div className="options-menu">
            {error && <div className="error-message">{error}</div>}
            <div className="options-item board-name">Board: {boardName}</div>
            <div className="options-item members-list">
              <div className="members-title">Membres :</div>
              {boardMembers.length > 0 ? (
                <ul>
                  {boardMembers.map(member => (
                    <li key={member._id} className="member-item">
                      <div className="member-avatar">
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <span className="member-email">{member.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun membre pour ce tableau.</p>
              )}
            </div>
            <div className="options-item">
              <button className="options-btn-add-member" onClick={() => setShowAddMemberForm(!showAddMemberForm)}>
                Ajouter un membre
              </button>
              {showAddMemberForm && (
                <div className="add-member-form">
                  <input
                    type="email"
                    placeholder="Email du membre"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                  <button onClick={HandleAddMember}>Ajouter</button>
                </div>
              )}
            </div>
            <div className="options-item">
              <button className="favorite-btn" onClick={handleToggleFavorite}>
                {boardFavorite ? "★ Favori" : "☆ Mettre en favoris"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="lists">
        {lists
          .filter((list) => !list.archive)
          .map((list, index) => (
            <div
              key={list._id}
              className="list"
              draggable
              onDragStart={(e) => handleDragStart(e, "list", list._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, list._id, index)}
            >
              <div className="list-header">
                {activeListId === list._id ? (
                  <div className="edit-list-name">
                    <input
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      ref={inputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          HandleRenameList(listName, list._id);
                          setActiveListId(null);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <h2
                    onClick={() => {
                      setActiveListId(list._id);
                      setListName(list.name);
                    }}
                  >
                    {list.name}
                  </h2>
                )}
                <button className="delete-list-btn"
                  onClick={() => {
                    setIsListArchived(true);
                    HandleArchiveList(list._id, isListArchived);
                  }}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
              {list.cards
                .filter((card) => !card.archive)
                .map((card, cardIndex) => (
                  <div
                    onClick={() => {
                      setActiveCardId(card._id);
                      setCardTitle(card.title);
                      setCardDesc(card.description);
                      setCardLabels(card.labels || []);
                      setActiveCardListId(list._id);
                      setAssignedUserId(card.asigne || "");
                    }}
                    key={card._id}
                    className="card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "card", card._id, list._id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, list._id, cardIndex)}
                  >
                    {card.labels && card.labels.length > 0 && (
                      <div className="card-tags">
                        {card.labels.map((label, idx) => (
                          <div
                            key={idx}
                            className="mini-tag"
                            style={{ backgroundColor: getLabelColor(label) }}
                          ></div>
                        ))}
                      </div>
                    )}
                    {card.labels.length > 0 ? (<div className="separator"></div>) : <div></div>}
                    <h3 className="card-title">{card.title}</h3>
                    {card.description && (
                      <div className="card-icons">
                        <span className="icon description-icon">📝</span>
                        {countLinks(card.description) > 0 && (
                          <span className="icon link-icon">🔗 {countLinks(card.description)}</span>
                        )}
                      </div>
                    )}
                    {card.asigne && (
                      <div className="card-member-avatar">
                        {boardMembers.find(member => member._id === card.asigne)?.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
              {activeCardId && (
                <>
                  <div className="overlay" onClick={() => setActiveCardId(null)}></div>
                  <div className="edit-card">
                    <button onClick={() => setActiveCardId(null)} className="close-button">
                      X
                    </button>
                    <h2>Modifier la carte</h2>
                    <input
                      type="text"
                      onChange={(e) => setCardTitle(e.target.value)}
                      placeholder="Titre de la carte"
                      value={cardTitle}
                      ref={titleRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          HandlePatchCardPannel(activeCardListId, activeCardId, cardTitle, cardDesc, cardLabels);
                      }}
                    />
                    <textarea
                      style={{ resize: "none" }}
                      onChange={(e) => setCardDesc(e.target.value)}
                      placeholder="Description de la carte"
                      value={cardDesc}
                      ref={descRef}
                    />
                    <button
                      type="submit"
                      onClick={() => {
                        HandlePatchCardPannel(activeCardListId, activeCardId, cardTitle, cardDesc, cardLabels);
                      }}
                    >
                      Sauvegarder
                    </button>
                    <button className="add-label-btn" onClick={() => setIsCreateLabelClicked(true)}>
                      Ajouter une étiquette
                    </button>
                    {isCreateLabelClicked ? (
                      <div>
                        <input
                          type="text"
                          placeholder="Saisissez un label"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newLabel.trim() !== "") {
                              const updatedLabels = [...(cardLabels || []), newLabel.trim()];
                              setCardLabels(updatedLabels);
                              HandlePatchCardPannel(activeCardListId, activeCardId, cardTitle, cardDesc, updatedLabels);
                              setNewLabel("");
                              setIsCreateLabelClicked(false);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (newLabel.trim() !== "") {
                              const updatedLabels = [...(cardLabels || []), newLabel.trim()];
                              setCardLabels(updatedLabels);
                              HandlePatchCardPannel(activeCardListId, activeCardId, cardTitle, cardDesc, updatedLabels);
                              setNewLabel("");
                              setIsCreateLabelClicked(false);
                            }
                          }}
                        >
                          Créer
                        </button>
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="label-container">
                      {cardLabels &&
                        cardLabels.map((label, index) => (
                          <div
                            key={index}
                            className="label"
                            style={{
                              backgroundColor: getLabelColor(label),
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "3px",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            {label}
                            <span
                              onClick={() =>
                                setCardLabels((prevLabels) =>
                                  prevLabels.filter((_, i) => i !== index)
                                )
                              }
                              style={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                              x
                            </span>
                          </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <label className="assigne-bold" style={{ marginRight: "5px", color: "#fff" }}>Assigné à :</label>
                      <select
                        value={assignedUserId}
                        onChange={(e) => setAssignedUserId(e.target.value)}
                      >
                        <option value="">--Sélectionnez--</option>
                        {boardMembers.map(member => (
                          <option key={member._id} value={member._id}>
                            {member.email}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          HandleAssignUser(activeCardListId, activeCardId, assignedUserId)
                        }
                        style={{ marginLeft: "5px" }}
                      >
                        Assigner
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setIsCardArchived(true);
                        HandleArchiveCard(activeCardListId, activeCardId, isCardArchived);
                      }}
                    >
                      Archiver
                    </button>
                  </div>
                </>
              )}
              {addingCardListId === list._id ? (
                <div className="card add-card">
                  <input
                    type="text"
                    name="title"
                    placeholder="Saisissez un titre ou copiez un lien"
                    value={cardTitles[list._id] || ""}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") HandleCreateCard(list._id);
                    }}
                    onChange={(e) =>
                      setCardTitles((prev) => ({
                        ...prev,
                        [list._id]: e.target.value,
                      }))
                    }
                  />
                  <div className="add-card-actions">
                    <button onClick={() => HandleCreateCard(list._id)}>Ajouter une carte</button>
                    <button className="cancel-btn" onClick={() => setAddingCardListId(null)}>
                      X
                    </button>
                  </div>
                </div>
              ) : (
                <button className="add-card-btn" onClick={() => setAddingCardListId(list._id)}>
                  + Ajouter une carte
                </button>
              )}
            </div>
          ))}
        <div className="list add-list">
          {isAddingList ? (
            <div className="add-list-form">
              <input
                type="text"
                name="name"
                placeholder="Saisissez le nom de la liste..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") HandleCreateList(name);
                }}
              />
              <div className="add-list-form-actions">
                <button onClick={() => HandleCreateList(name)}>Ajouter une liste</button>
                <button className="cancel-btn" onClick={() => setIsAddingList(false)}>
                  X
                </button>
              </div>
            </div>
          ) : (
            <button className="add-list-btn" onClick={() => setIsAddingList(true)}>
              + Ajouter une autre liste
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandleList;
