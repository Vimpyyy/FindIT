import { useState } from 'react';
import axios from 'axios';
import './FoundItemForm.css'; // Import the CSS file

function FoundItemForm() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [founderName, setFounderName] = useState('');
  const [founderPhoneNumber, setFounderPhoneNumber] = useState('');
  const [founderEmail, setFounderEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!itemName || !description || !location || !image || !founderName || !founderPhoneNumber || !founderEmail) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('image', image);
    formData.append('founderName', founderName);
    formData.append('founderPhoneNumber', founderPhoneNumber);
    formData.append('founderEmail', founderEmail);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to report a found item.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/found-items', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Item reported successfully!');
    } catch (error) {
      console.error('Error reporting found item:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to report the item. Please try again.');
    }
  };

  return (
    <div className="found-item-form">
      <h2>Report Found Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name</label>
          <input
            id="itemName"
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                setImage(e.target.files[0]);
              } else {
                alert('Please upload a valid image file.');
              }
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="founderName">Founder's Name</label>
          <input
            id="founderName"
            type="text"
            placeholder="Enter founder's name"
            value={founderName}
            onChange={(e) => setFounderName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="founderPhoneNumber">Founder's Phone Number</label>
          <input
            id="founderPhoneNumber"
            type="tel"
            placeholder="Enter founder's phone number"
            value={founderPhoneNumber}
            onChange={(e) => setFounderPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="founderEmail">Founder's Email</label>
          <input
            id="founderEmail"
            type="email"
            placeholder="Enter founder's email"
            value={founderEmail}
            onChange={(e) => setFounderEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FoundItemForm;