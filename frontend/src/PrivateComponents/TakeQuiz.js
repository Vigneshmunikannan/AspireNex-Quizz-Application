import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../routes/Context';
import { useNavigate, useParams } from 'react-router-dom';
import MessageComponent from '../Response/Message';

const QuizList = () => {
    const { isValidTokenAvailable, accessToken, logout } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState({ score: 0, answers: [] });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // New state to keep track of the current question index

    useEffect(() => {
        if (!isValidTokenAvailable()) {
            navigate('/', { replace: true });
        }

        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/quiz/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setQuiz(response.data);
                setAnswers(new Array(response.data.questions.length).fill(null));
            } catch (error) {
                handleApiError(error);
            }
        };

        fetchQuiz();
    }, []);

    const handleApiError = (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                setErrorMessage('Invalid session');
                setTimeout(() => {
                    setErrorMessage('');
                    logout();
                }, 3000);
            } else if (error.response.status === 404) {
                setErrorMessage('Quiz not found');
                setTimeout(() => navigate('/quiz-list', { replace: true }), 3000);
            }
            else if(error.response.status === 400){
                setErrorMessage(error.response.data.message);
                setTimeout(() => {
                    setErrorMessage('')
                    navigate('/quiz-list', { replace: true })
                }, 3000);
            } 
            else {
                setErrorMessage(error.response.data.message);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } else if (error.request) {
            setErrorMessage('Network error. Please try again later.');
            setTimeout(() => setErrorMessage(''), 3000);
        } else {
            console.error('Error:', error.message);
        }
    };

    const handleAnswerChange = (index, selectedOption) => {
        const newAnswers = [...answers];
        newAnswers[index] = selectedOption;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/quizzes/${id}/submit`, {
                answers,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setResult(response.data);
            setCompleted(true);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleGoToHome2 = () => {
        navigate('/quiz-list', { replace: true });
    };

    if (errorMessage) {
        return <MessageComponent message={errorMessage} type="error" />;
    }

    if (!quiz) {
        return <div className="loading-text">Loading...</div>;
    }

    return (
        <div className="quiz-list-container">
            {completed ? (
                <div className="quiz-result-container">
                    <h2>Quiz Result</h2>
                    <p className="score">Your score: {result.score}/{quiz.questions.length}</p>
                    <div className="answers-list">
                        {quiz.questions.map((question, index) => (
                            <div key={index} className="question-result">
                                <p className="question">{question.questionText}</p>
                                <p className="correct-answer">
                                    <strong>Correct Answer:</strong> {quiz.questions[index].options[question.correctAnswer]}
                                </p>
                                <p className="user-answer">
                                    <strong>Your Answer:</strong> {result.answers[index] !== null ? quiz.questions[index].options[result.answers[index]] : 'Not answered'}
                                </p>
                            </div>
                        ))}
                        <button onClick={handleGoToHome2} className="error-button">
                            Go to List
                        </button>
                    </div>
                </div>
            ) : (
                <div className="take-quiz-container">
                    <h2>{quiz.title}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="question-block">
                            <h3>Question {currentQuestionIndex + 1}</h3>
                            <p>{quiz.questions[currentQuestionIndex].questionText}</p>
                            <div className="options-block">
                                {quiz.questions[currentQuestionIndex].options.map((option, optIndex) => (
                                    <div key={optIndex} className="option">
                                        <input
                                            type="radio"
                                            id={`option-${currentQuestionIndex}-${optIndex}`}
                                            name={`question-${currentQuestionIndex}`}
                                            value={optIndex}
                                            checked={answers[currentQuestionIndex] === optIndex}
                                            onChange={() => handleAnswerChange(currentQuestionIndex, optIndex)}
                                        />
                                        <label htmlFor={`option-${currentQuestionIndex}-${optIndex}`}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="navigation-buttons">
                            {currentQuestionIndex > 0 && (
                                <button type="button" onClick={handlePreviousQuestion}>Previous</button>
                            )}
                            {currentQuestionIndex < quiz.questions.length - 1 ? (
                                <button type="button" onClick={handleNextQuestion}>Next</button>
                            ) : (
                                <button type="submit">Submit Quiz</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default QuizList;
