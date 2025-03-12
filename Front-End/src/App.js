import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './AuthPages/Register';
import Login from './AuthPages/Login';
import Board from './MainPages/Board';
import InBoard from './MainPages/inBoard/inBoard';
import Navbar from './Components/Navbar/Navbar';
import DiscordCallback from './AuthPages/DiscordCallback';
import MonCompte from './MainPages/Account';
import Favoris from './MainPages/Favourites';
import RecentBoards from './MainPages/RecentBoards';
import LandingPage from './MainPages/LandingPage';

import ProtectRoutes from './Handling/ProtectRoutes';

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login', '/register'];
  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar></Navbar>}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/board"
          element={
            <ProtectRoutes>
              <Board />
            </ProtectRoutes>
          }
        />
        <Route
          path="/mon-compte"
          element={
            <ProtectRoutes>
              <MonCompte />
            </ProtectRoutes>
          }
        />
        <Route
          path="/recent"
          element={
            <ProtectRoutes>
              <RecentBoards />
            </ProtectRoutes>
          }
        />
        <Route
          path="/favoris"
          element={
            <ProtectRoutes>
              <Favoris />
            </ProtectRoutes>
          }
        />
        <Route
          path="/board/:boardID"
          element={
            <ProtectRoutes>
              <InBoard />
            </ProtectRoutes>
          }
        />
        <Route path="/discord/callback" element={<DiscordCallback />} />
      </Routes>
    </>
  );
};

export default App;
