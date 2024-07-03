import React, { useState } from 'react';
import MessageComponent from '../Response/Message';
import axios from 'axios'
import { useAuth } from "../routes/Context";
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error) => {
    setIsLoading(false);
    setErrorMessage(error.response.data.message);
    setTimeout(() => {
      setErrorMessage('')
    }, 3000);
  }
  const handleRegister = async () => {
    if (!username || !password || !name || !email) {
      setErrorMessage('All fields are mandatory');
      setTimeout(() => {
        setErrorMessage('')
      }, 3000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format');
      setTimeout(() => {
        setErrorMessage('')
      }, 3000);
      return;
    }
    try {
      if (isLoading) return;
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        username: username,
        name: name,
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setIsLoading(false);
      setSuccessMessage(response.data.msg)
      setTimeout(() => {
        setSuccessMessage('')
        setUsername('');
        setEmail('');
        setPassword('');
        setName('');
      }, 3000);


    } catch (error) {
      handleError(error)
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('All fields are mandatory');
      setTimeout(() => {
        setErrorMessage('')
      }, 3000);
      return;
    }
    try {
      if (isLoading) return; // Prevent multiple requests
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setIsLoading(false);
      console.log(response.data)
      setSuccessMessage(response.data.msg)
      login(response.data.token)
      setTimeout(() => {
        setSuccessMessage('')
        setUsername('');
        setEmail('');
        setPassword('');
        setName('');
        navigate('/create-quiz', { replace: false });
      }, 1000);
    } catch (error) {
      handleError(error)
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setSuccessMessage('')
    setUsername('');
    setEmail('');
    setPassword('');
    setName('');
    setIsLoading(false)
  };

  return (
    <div className="auth-form-container">
      {successMessage && <MessageComponent type="success" message={successMessage} />}
      {errorMessage && <MessageComponent type="error" message={errorMessage} />}
      <div className="auth-form">
        {isRegistering ? (
          <div>
            <h2>Register</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleRegister}>Register</button>
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
        <button className="toggle-button" onClick={toggleForm}>
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
