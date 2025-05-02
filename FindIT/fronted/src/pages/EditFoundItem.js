import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditFoundItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    itemName: "",
    description: "",
    location: "",
    imageUrl: "",
    founderName: "",
    founderPhoneNumber: "",
    founderEmail: "",
  });

  useEffect(() => {
    axios
      .get(`/api/found-items/${id}`)
      .then((response) => setItemData(response.data))
      .catch((error) => console.error("Error fetching item:", error));
  }, [id]);

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/found-items/${id}`, itemData);
      navigate("/dashboard"); // Redirect after update
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div>
      <h2>Edit Found Item</h2>
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
          <label>Founder's Name</label>
          <input
            type="text"
            name="founderName"
            value={itemData.founderName}
            onChange={handleChange}
            placeholder="Founder's Name"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Founder's Phone Number</label>
          <input
            type="tel"
            name="founderPhoneNumber"
            value={itemData.founderPhoneNumber}
            onChange={handleChange}
            placeholder="Founder's Phone Number"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Founder's Email</label>
          <input
            type="email"
            name="founderEmail"
            value={itemData.founderEmail}
            onChange={handleChange}
            placeholder="Founder's Email"
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
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

export default EditFoundItem;
