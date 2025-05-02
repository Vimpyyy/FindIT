import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Automatically integrates with jsPDF
import matchItems from './matching';
import Header from '../components/Header'; // Import Header
import Footer from '../components/Footer'; // Import Footer

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [hasMatches, setHasMatches] = useState(false); // State to track if there are matches
  const [showMatches, setShowMatches] = useState(false); // State to toggle matched items view
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    gender: '',
    itemName: '',
    description: '',
    location: '',
    image: null,
    ownerName: '',
    ownerPhoneNumber: '',
    ownerEmail: '',
    ownerAddress: '',
    founderName: '',
    founderPhoneNumber: '',
    founderEmail: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          contactNumber: res.data.contactNumber,
          gender: res.data.gender,
        });

        const lostRes = await axios.get('http://localhost:5000/api/lost-items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLostItems(lostRes.data.filter((item) => item.user === res.data._id));

        const foundRes = await axios.get('http://localhost:5000/api/found-items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoundItems(foundRes.data.filter((item) => item.user === res.data._id));
      } catch (error) {
        console.error('Error fetching user details or items:', error);
        alert('Failed to fetch user details or items. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Fetch feedbacks for the logged-in user
    axios
      .get('http://localhost:5000/api/feedback/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
        },
      })
      .then((res) => {
        setUserFeedbacks(res.data);
      })
      
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const lostItemsResponse = await axios.get('http://localhost:5000/api/lost-items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundItemsResponse = await axios.get('http://localhost:5000/api/found-items', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lostItems = lostItemsResponse.data;
        const foundItems = foundItemsResponse.data;

        const allMatches = await matchItems(lostItems, foundItems);

        // Filter matches for the logged-in user
        const userMatches = allMatches.filter(
          (match) =>
            match.lostItem.ownerId === user._id || match.foundItem.founderId === user._id
        );

        setMatches(userMatches);

        // Update the indicator state
        setHasMatches(userMatches.length > 0);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [user._id]); // Add user._id as a dependency

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('token');
      alert('Your account has been deleted successfully.');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/users/me',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleDeleteItem = async (id, type) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint =
        type === 'lost'
          ? `http://localhost:5000/api/lost-items/${id}`
          : `http://localhost:5000/api/found-items/${id}`;
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === 'lost') {
        setLostItems(lostItems.filter((item) => item._id !== id));
      } else {
        setFoundItems(foundItems.filter((item) => item._id !== id));
      }

      alert(`${type === 'lost' ? 'Lost' : 'Found'} item deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${type} item:`, error);
      alert(`Failed to delete ${type} item. Please try again.`);
    }
  };

  const handleEditClick = (item, type) => {
    setEditingItem({ ...item, type });
    setFormData({
      itemName: item.itemName,
      description: item.description,
      location: item.location,
      image: null,
      ownerName: item.ownerName || '',
      ownerPhoneNumber: item.ownerPhoneNumber || '',
      ownerEmail: item.ownerEmail || '',
      ownerAddress: item.ownerAddress || '',
      founderName: item.founderName || '',
      founderPhoneNumber: item.founderPhoneNumber || '',
      founderEmail: item.founderEmail || '',
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (editingItem.type === 'lost') {
        formDataToSend.append('ownerName', formData.ownerName);
        formDataToSend.append('ownerPhoneNumber', formData.ownerPhoneNumber);
        formDataToSend.append('ownerEmail', formData.ownerEmail);
        formDataToSend.append('ownerAddress', formData.ownerAddress);
      } else if (editingItem.type === 'found') {
        formDataToSend.append('founderName', formData.founderName);
        formDataToSend.append('founderPhoneNumber', formData.founderPhoneNumber);
        formDataToSend.append('founderEmail', formData.founderEmail);
      }

      const endpoint =
        editingItem.type === 'lost'
          ? `http://localhost:5000/api/lost-items/${editingItem._id}`
          : `http://localhost:5000/api/found-items/${editingItem._id}`;

      const res = await axios.put(endpoint, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (editingItem.type === 'lost') {
        setLostItems(
          lostItems.map((item) =>
            item._id === editingItem._id ? res.data : item
          )
        );
      } else {
        setFoundItems(
          foundItems.map((item) =>
            item._id === editingItem._id ? res.data : item
          )
        );
      }

      setEditingItem(null);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add Profile Information
    doc.setFontSize(16);
    doc.text(`User Profile - ${user.name}`, 10, 10);
    doc.setFontSize(12);
    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Name', user.name],
        ['Email', user.email],
        ['Contact', user.contactNumber],
        ['Gender', user.gender],
      ],
      startY: 20,
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // Add Lost Items Table
    if (lostItems.length > 0) {
      doc.text('Lost Items', 10, currentY);
      currentY += 5;

      for (const item of lostItems) {
        // Add item details
        doc.autoTable({
          head: [['Field', 'Value']],
          body: [
            ['Item Name', item.itemName],
            ['Description', item.description],
            ['Location', item.location],
            ['Owner Name', item.ownerName],
            ['Owner Phone', item.ownerPhoneNumber],
            ['Owner Email', item.ownerEmail],
            ['Owner Address', item.ownerAddress],
          ],
          startY: currentY,
        });

        currentY = doc.lastAutoTable.finalY + 5;

        // Add item image
        if (item.image) {
          const imageUrl = `http://localhost:5000/${item.image}`;
          const imageBase64 = await getBase64FromUrl(imageUrl);
          doc.addImage(imageBase64, 'JPEG', 10, currentY, 50, 50);
          currentY += 55;
        }
      }
    }

    // Add Found Items Table
    if (foundItems.length > 0) {
      doc.text('Found Items', 10, currentY);
      currentY += 5;

      for (const item of foundItems) {
        // Add item details
        doc.autoTable({
          head: [['Field', 'Value']],
          body: [
            ['Item Name', item.itemName],
            ['Description', item.description],
            ['Location', item.location],
            ['Founder Name', item.founderName],
            ['Founder Phone', item.founderPhoneNumber],
            ['Founder Email', item.founderEmail],
          ],
          startY: currentY,
        });

        currentY = doc.lastAutoTable.finalY + 5;

        // Add item image
        if (item.image) {
          const imageUrl = `http://localhost:5000/${item.image}`;
          const imageBase64 = await getBase64FromUrl(imageUrl);
          doc.addImage(imageBase64, 'JPEG', 10, currentY, 50, 50);
          currentY += 55;
        }
      }
    }

    // Save the PDF
    doc.save('Profile_Report.pdf');
  };

 

  <div className="feedback-list">
  {userFeedbacks.map((feedback) => (
    <div className="feedback-card" key={feedback._id}>
      <p>{feedback.feedback}</p>
      <div className="feedback-actions">
        <Link to={`/edit-feedback/${feedback._id}`}>
          <button className="edit-button">Edit</button>
        </Link>
        <Link to={`/delete-feedback/${feedback._id}`}>
          <button className="delete-button">Delete</button>
        </Link>
      </div>
    </div>
  ))}
</div>

  return (
    <div className="profile-container">
      <Header /> {/* Render Header */}
      <div className="profile-content">
        
        {user.name && <h2 className="profile-welcome">Hello, {user.name}!</h2>}

        <button
          className="delete-account-button"
          onClick={handleDeleteAccount}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Delete Account
        </button>

        <button
          className="generate-pdf-button"
          onClick={generatePDF}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Generate details PDF
        </button>

      

        {hasMatches && (
          <div className="match-indicator">
            <p>You have matched items!</p>
            <button
              className="view-matches-button"
              onClick={() => setShowMatches(true)}
            >
              View Matched Items
            </button>
          </div>
        )}

        {showMatches && (
          <div className="matched-items-container">
            <h2>Matched Items</h2>
            {matches.length > 0 ? (
              matches.map((match, index) => (
                <div key={index} className="matched-item-card">
                  <div className="matched-item-section">
                    <h3>Lost Item Details</h3>
                    <p><strong>Item Name:</strong> {match.lostItem.itemName || 'N/A'}</p>
                    <p><strong>Description:</strong> {match.lostItem.description || 'N/A'}</p>
                    <p><strong>Location:</strong> {match.lostItem.location || 'N/A'}</p>
                    <p><strong>Owner's Name:</strong> {match.lostItem.ownerName || 'N/A'}</p>
                    <p><strong>Owner's Phone:</strong> {match.lostItem.ownerPhoneNumber || 'N/A'}</p>
                    <p><strong>Owner's Email:</strong> {match.lostItem.ownerEmail || 'N/A'}</p>
                    {match.lostItem.image && (
                      <img
                        src={`http://localhost:5000/${match.lostItem.image}`}
                        alt="Lost Item"
                        className="matched-item-image"
                      />
                    )}
                  </div>

                  <div className="matched-item-section">
                    <h3>Found Item Details</h3>
                    <p><strong>Item Name:</strong> {match.foundItem.itemName || 'N/A'}</p>
                    <p><strong>Description:</strong> {match.foundItem.description || 'N/A'}</p>
                    <p><strong>Location:</strong> {match.foundItem.location || 'N/A'}</p>
                    <p><strong>Founder's Name:</strong> {match.foundItem.founderName || 'N/A'}</p>
                    <p><strong>Founder's Phone:</strong> {match.foundItem.founderPhoneNumber || 'N/A'}</p>
                    <p><strong>Founder's Email:</strong> {match.foundItem.founderEmail || 'N/A'}</p>
                    {match.foundItem.image && (
                      <img
                        src={`http://localhost:5000/${match.foundItem.image}`}
                        alt="Found Item"
                        className="matched-item-image"
                      />
                    )}
                  </div>

                  <div className="matched-item-section">
                    <p><strong>Match Score:</strong> {match.matchScore}%</p>
                    <div className="matched-item-actions">
                      <button
                        className="message-button"
                        onClick={() => {
                          if (!match.lostItem.ownerId || !match.foundItem.founderId) {
                            alert('Owner ID or Founder ID is missing!');
                            return;
                          }
                          navigate(`/chat?room=${match.lostItem.ownerId}-${match.foundItem.founderId}`);
                        }}
                      >
                        Message
                      </button>
                      <button
                        className="close-matches-button"
                        onClick={() => setShowMatches(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No matches found.</p>
            )}
          </div>
        )}

        <form className="profile-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Contact Number:
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleFormChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {isEditing ? (
            <div>
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </form>

        <h2>Your Lost Items</h2>
        <div className="items-container">
          {lostItems.length > 0 ? (
            lostItems.map((item) => (
              <div key={item._id} className="item-card">
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.itemName}
                  className="item-image"
                />
                <div className="item-details">
                  <h3><strong>Item Name:</strong> {item.itemName}</h3>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Owner's Name:</strong> {item.ownerName}</p>
                  <p><strong>Owner's Phone:</strong> {item.ownerPhoneNumber}</p>
                  <p><strong>Owner's Email:</strong> {item.ownerEmail}</p>
                  <p><strong>Owner's Address:</strong> {item.ownerAddress}</p>
                  <button onClick={() => handleEditClick(item, 'lost')}>Edit</button>
                  <button onClick={() => handleDeleteItem(item._id, 'lost')}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No lost items found.</p>
          )}
        </div>

        <h2>Your Found Items</h2>
        <div className="items-container">
          {foundItems.length > 0 ? (
            foundItems.map((item) => (
              <div key={item._id} className="item-card">
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.itemName}
                  className="item-image"
                />
                <div className="item-details">
                  <h3><strong>Item Name:</strong> {item.itemName}</h3>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Founder's Name:</strong> {item.founderName}</p>
                  <p><strong>Founder's Phone:</strong> {item.founderPhoneNumber}</p>
                  <p><strong>Founder's Email:</strong> {item.founderEmail}</p>
                  <button onClick={() => handleEditClick(item, 'found')}>Edit</button>
                  <button onClick={() => handleDeleteItem(item._id, 'found')}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No found items found.</p>
          )}
        </div>

        {editingItem && (
          <div className="edit-box">
            <h2>Edit Item</h2>
            <form>
              <label>
                Item Name:
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                />
              </label>
              {editingItem.type === 'lost' && (
                <>
                  <label>
                    Owner's Name:
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label>
                    Owner's Phone Number:
                    <input
                      type="tel"
                      name="ownerPhoneNumber"
                      value={formData.ownerPhoneNumber}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label>
                    Owner's Email:
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label>
                    Owner's Address:
                    <textarea
                      name="ownerAddress"
                      value={formData.ownerAddress}
                      onChange={handleFormChange}
                    />
                  </label>
                </>
              )}
              {editingItem.type === 'found' && (
                <>
                  <label>
                    Founder's Name:
                    <input
                      type="text"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label>
                    Founder's Phone Number:
                    <input
                      type="tel"
                      name="founderPhoneNumber"
                      value={formData.founderPhoneNumber}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label>
                    Founder's Email:
                    <input
                      type="email"
                      name="founderEmail"
                      value={formData.founderEmail}
                      onChange={handleFormChange}
                    />
                  </label>
                </>
              )}
              <label>
                Image:
                <input
                  type="file"
                  name="image"
                  onChange={handleFormChange}
                />
              </label>
              <div className="edit-box-buttons">
                <button type="button" onClick={handleSaveEdit}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h1>Your Feedbacks</h1>
        <div className="feedback-list">
  {userFeedbacks.map((feedback) => (
    <div className="feedback-card" key={feedback._id}>
      <p>{feedback.feedback}</p>
      <div className="feedback-actions">
        <Link to={`/edit-feedback/${feedback._id}`}>
          <button className="edit-button">Edit</button>
        </Link>
        <Link to={`/delete-feedback/${feedback._id}`}>
          <button className="delete-button">Delete</button>
        </Link>
      </div>
    </div>
  ))}
</div>
      </div>
      <Footer /> {/* Render Footer */}
    </div>
  );
};

export default Profile;