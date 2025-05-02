import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditLostItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    itemName: "",
    description: "",
    location: "",
    imageUrl: "",
    ownerName: "",
    ownerPhoneNumber: "",
    ownerEmail: "",
    ownerAddress: "",
  });

  useEffect(() => {
    axios
      .get(`/api/lost-items/${id}`)
      .then((response) => setItemData(response.data))
      .catch((error) => console.error("Error fetching item:", error));
  }, [id]);

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/lost-items/${id}`, itemData);
      navigate("/dashboard"); // Redirect after update
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div>
      <h2>Edit Lost Item</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Item Name</label>
          <input
            type="text"
            name="itemName"
            value={itemData.itemName}
            onChange={handleChange}
            placeholder="Item Name"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            name="description"
            value={itemData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", resize: "none" }}
          ></textarea>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={itemData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={itemData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Owner's Name</label>
          <input
            type="text"
            name="ownerName"
            value={itemData.ownerName}
            onChange={handleChange}
            placeholder="Owner's Name"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Owner's Phone Number</label>
          <input
            type="tel"
            name="ownerPhoneNumber"
            value={itemData.ownerPhoneNumber}
            onChange={handleChange}
            placeholder="Owner's Phone Number"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Owner's Email</label>
          <input
            type="email"
            name="ownerEmail"
            value={itemData.ownerEmail}
            onChange={handleChange}
            placeholder="Owner's Email"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Owner's Address</label>
          <textarea
            name="ownerAddress"
            value={itemData.ownerAddress}
            onChange={handleChange}
            placeholder="Owner's Address"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", resize: "none" }}
          ></textarea>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditLostItem;
