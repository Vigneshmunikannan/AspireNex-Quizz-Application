import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/Context';

export default function Error() {
  const navigate = useNavigate();
  const { isValidTokenAvailable } = useAuth();

  const handleGoToHome1 = () => {
    navigate('/create-quiz', { replace: true });
  };

  const handleGoToHome2 = () => {
    navigate('/', { replace: true });
  };

  // Check if the user is authenticated
  if (isValidTokenAvailable()) {
    return (
      <div className='error-container'>
        <div className='error-content'>
          <p className="error-text">404 page requested</p>
          <button onClick={handleGoToHome1} className="error-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className='error-container'>
        <div className='error-content'>
          <p className="error-text">404 page requested</p>
          <button onClick={handleGoToHome2} className="error-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  }
}
