import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditFeedback.css'; // Optional: Add styling for this page

const EditFeedback = () => {
  const { feedbackId } = useParams(); // Get feedback ID from the URL
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the feedback details
    axios
      .get(`http://localhost:5000/api/feedback/${feedbackId}`)
      .then((res) => {
        setFeedback(res.data.feedback);
      })
      .catch((err) => {
        console.error('Failed to fetch feedback:', err);
        setError('Failed to load feedback.');
      });
  }, [feedbackId]);

  const handleUpdateFeedback = () => {
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/feedback/${feedbackId}`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
        }
      )
      .then((res) => {
        console.log('Feedback updated successfully:', res.data);
        navigate('/profile'); // Redirect to profile page
      })
      .catch((err) => {
        console.error('Failed to update feedback:', err); // Log the entire error object
        if (err.response) {
          console.error('Response status:', err.response.status); // HTTP status code
          console.error('Response data:', err.response.data); // Server response data
        } else if (err.request) {
          console.error('Request error:', err.request); // Request was made but no response received
        } else {
          console.error('Error message:', err.message); // General error message
        }
        setError('Failed to update feedback.');
      });
  };

  return (
    <div className="edit-feedback-container">
      <h1>Edit Feedback</h1>
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Edit your feedback..."
        className="edit-feedback-input"
      />
      <button onClick={handleUpdateFeedback} className="edit-feedback-button">
        Update Feedback
      </button>
    </div>
  );
};

export default EditFeedback;