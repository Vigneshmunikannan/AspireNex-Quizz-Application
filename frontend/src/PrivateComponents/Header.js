import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../routes/Context';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav__list nav__list--left">
          <li className="nav__item">
            <Link to="/create-quiz" className="nav__link">Create Quiz</Link>
          </li>
          <li className="nav__item">
            <Link to="/quiz-list" className="nav__link">QuizList</Link>
          </li>
        </ul>
        <ul className="nav__list nav__list--right">
          <li className="nav__item">
            <button onClick={handleLogout} className="nav__button">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
