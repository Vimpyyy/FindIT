import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
  const [lostItems, setLostItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch lost items
    axios
      .get('http://localhost:5000/api/lost-items')
      .then((res) => {
        setLostItems(res.data);
        setFilteredItems(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setError('Lost items not found.');
        } else {
          setError('Failed to fetch lost items.');
        }
      });

    // Fetch feedback
    axios
      .get('http://localhost:5000/api/feedback')
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch feedback:', error);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = lostItems.filter((item) =>
      item.itemName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  const handleAddFeedback = () => {
    if (!newFeedback.trim()) {
      alert('Feedback cannot be empty!');
      return;
    }

    axios
      .post(
        'http://localhost:5000/api/feedback',
        { feedback: newFeedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        setFeedbacks((prevFeedbacks) => [...prevFeedbacks, res.data]);
        setNewFeedback('');
        setIsModalOpen(false);
        alert('Feedback submitted successfully!');
      })
      .catch((error) => {
        console.error('Failed to add feedback:', error);
        alert('Failed to submit feedback. Please try again.');
      });
  };

  return (
    <div className="home-container">
      <Header />

      <main>
        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search lost items..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {/* Lost Items Section */}
        <h2 className="section-title">Lost Items</h2>
        <div className="lost-items-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="lost-item-card" key={item._id}>
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.itemName}
                  className="lost-item-image"
                />
                <div className="lost-item-details">
                  <h3>{item.itemName}</h3>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Owner's Name:</strong> {item.ownerName}</p>
                  <p><strong>Owner's Phone:</strong> {item.ownerPhoneNumber}</p>
                  <p><strong>Owner's Email:</strong> {item.ownerEmail}</p>
                  <p><strong>Owner's Address:</strong> {item.ownerAddress}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items-message">No lost items found.</p>
          )}
        </div>

        {/* Feedback Section */}
        <h2 className="section-title">Feedback</h2>
        <div className="feedback-container">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div className="feedback-card" key={feedback._id}>
                <div className="feedback-icon">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <div className="feedback-content">
                  <p className="feedback-text">"{feedback.feedback}"</p>
                  <span className="feedback-author">- {feedback.authorName || 'Anonymous'}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-feedback-message">No feedback available yet. Be the first to share your thoughts!</p>
          )}
        </div>

        {/* Add Feedback Button */}
        <button
          className="add-feedback-button"
          onClick={() => setIsModalOpen(true)}
        >
          Add Feedback
        </button>

        {/* Feedback Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Feedback</h3>
              <textarea
                placeholder="Write your feedback..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                className="feedback-input"
              />
              <div className="modal-actions">
                <button onClick={handleAddFeedback} className="modal-submit-button">
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="modal-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;