import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DeleteFeedback.css'; // Optional: Add styling for this page

const DeleteFeedback = () => {
  const { feedbackId } = useParams(); // Get feedback ID from the URL
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the feedback details
    axios
      .get(`http://localhost:5000/api/feedback/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setFeedback(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch feedback:', err);
        setError('Failed to load feedback.');
      });
  }, [feedbackId]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/feedback/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        alert('Feedback deleted successfully!');
        navigate('/profile'); // Redirect to the profile page
      })
      .catch((error) => {
        console.error('Failed to delete feedback:', error);

        let errorMessage = 'Failed to delete feedback.'; // Default error message

        if (error.response) {
          // The server responded with a status code outside the 2xx range
          if (error.response.status === 404) {
            errorMessage = 'Feedback not found.';
          } else if (error.response.status === 401 || error.response.status === 403) {
            errorMessage = 'You are not authorized to delete this feedback.';
          } else if (error.response.status >= 500) {
            errorMessage = 'Server error while deleting feedback.';
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message; // Use server's error message if available
          }
          console.error('Server error:', error.response.status, error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          errorMessage = 'No response from server. Please check your network connection.';
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
          errorMessage = 'Error setting up request.';
        }

        setError(errorMessage); // Update the error state to display the message in the UI
      });
  };

  return (
    <div className="delete-feedback-container">
      <h1>Delete Feedback</h1>
      {error && <p className="error-message">{error}</p>}
      {feedback ? (
        <div className="feedback-details">
          <p>Are you sure you want to delete this feedback?</p>
          <blockquote>{feedback.feedback}</blockquote>
          <div className="delete-feedback-actions">
            <button onClick={handleDelete} className="delete-button">
              Yes, Delete
            </button>
            <button onClick={() => navigate('/profile')} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>Loading feedback details...</p>
      )}
    </div>
  );
};

export default DeleteFeedback;