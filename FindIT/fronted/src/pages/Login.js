import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ParticlesBg from "particles-bg";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Delayed form appearance for smooth transition
  useEffect(() => {
    setTimeout(() => setShowForm(true), 3000); // 3s delay for welcome animation
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert("Login failed. No token received.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="login-page">
      {/* Background Animation */}
      <ParticlesBg type="circle" bg={true} />
      
      {/* Welcome Message */}
      {!showForm && (
        <div className="welcome-container">
          <h1 className="welcome-text">Welcome to FindIt</h1>
          <p className="welcome-subtext">The best way to find what you’ve lost.</p>
        </div>
      )}

      {/* Login Form Appears After Animation */}
      {showForm && (
        <div className="login-container fade-in">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <div className="register-link">
            <p>Don't have an account?</p>
            <button onClick={() => navigate('/register')} className="register-btn">Register</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
