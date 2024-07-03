import React, { useEffect, useState } from 'react';
import { useAuth } from "../routes/Context";
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import MessageComponent from '../Response/Message';
export default function Quizlist() {
    const { isValidTokenAvailable, accessToken, logout } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [quizzes, setQuizzes] = useState([]);
    useEffect(() => {
        if (!isValidTokenAvailable()) {
            navigate('/', { replace: true });
        }

        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setQuizzes(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invaild session')
                    setTimeout(() => {
                        setErrorMessage('')
                        logout();  
                    }, 3000);
                }
                else {
                    setErrorMessage(error.response.data.message)
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            }
        };

        fetchQuizzes();

    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/quizzes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            setSuccessMessage('Quiz deleted successfully!');
            setQuizzes(quizzes.filter((quiz) => quiz._id !== id));

            // Hide the message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invaild session')
                setTimeout(() => {
                    setErrorMessage('')
                    logout();  
                }, 3000);
            }
            else {
                setErrorMessage(error.response.data.message)
                setTimeout(() => setErrorMessage(''), 3000);
            }
        }
    };

    const handleAttemptQuiz = (id) => {
        navigate(`/take-quiz/${id}`, { replace: true });
    };
    return (
        <>
            <div className="quiz-list-container">
                <h2>Quiz List</h2>
                {successMessage && <MessageComponent type="success" message={successMessage} />}
                {errorMessage && <MessageComponent type="error" message={errorMessage} />}
                <ul className="quiz-list">
                    {quizzes.map((quiz) => (
                        <li key={quiz._id} className="quiz-item">
                            <span>{quiz.title}</span>
                            <div>
                                <button onClick={() => handleAttemptQuiz(quiz._id)} className="attempt-btn">Attempt Quiz</button>
                                <button onClick={() => handleDelete(quiz._id)} className="delete-btn">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
