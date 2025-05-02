import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LostItemForm from './pages/LostItemForm';
import FoundItemForm from './pages/FoundItemForm';
import EditFoundItem from './pages/EditFoundItem';
import EditLostItem from './pages/EditLostItem';
import Chat from './pages/Chat';
import EditFeedback from './pages/EditFeedback';
import DeleteFeedback from './pages/DeleteFeedback';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lost-item" element={<LostItemForm />} />
        <Route path="/found-item" element={<FoundItemForm />} />
        <Route path="/edit-found-item/:id" element={<EditFoundItem />} />
        <Route path="/edit-lost-item/:id" element={<EditLostItem />} />
        <Route path="/edit-feedback/:feedbackId" element={<EditFeedback />} />
        <Route path="/delete-feedback/:feedbackId" element={<DeleteFeedback />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;