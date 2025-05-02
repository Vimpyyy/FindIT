import { useState } from 'react';
import axios from 'axios';
import './LostItemForm.css'; // Import the CSS file

function LostItemForm() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!itemName || !description || !location || !image || !ownerName || !ownerPhoneNumber || !ownerEmail || !ownerAddress) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('image', image);
    formData.append('ownerName', ownerName);
    formData.append('ownerPhoneNumber', ownerPhoneNumber);
    formData.append('ownerEmail', ownerEmail);
    formData.append('ownerAddress', ownerAddress);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to report a lost item.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/lost-items', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Lost item reported successfully!');
    } catch (error) {
      console.error('Error reporting lost item:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to report the lost item. Please try again.');
    }
  };

  return (
    <div className="lost-item-form">
      <h2>Report Lost Item</h2>
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
          <label htmlFor="ownerName">Owner's Name</label>
          <input
            id="ownerName"
            type="text"
            placeholder="Enter owner's name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerPhoneNumber">Owner's Phone Number</label>
          <input
            id="ownerPhoneNumber"
            type="tel"
            placeholder="Enter owner's phone number"
            value={ownerPhoneNumber}
            onChange={(e) => setOwnerPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerEmail">Owner's Email</label>
          <input
            id="ownerEmail"
            type="email"
            placeholder="Enter owner's email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerAddress">Owner's Address</label>
          <textarea
            id="ownerAddress"
            placeholder="Enter owner's address"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LostItemForm;