import React, { useEffect, useState } from 'react';
import { useAuth } from "../routes/Context";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageComponent from '../Response/Message';
export default function CreateQuiz() {
    const { isValidTokenAvailable, accessToken, logout } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

  console.log(accessToken)
    useEffect(() => {
        if (!isValidTokenAvailable()) {
            navigate('/', { replace: true });
        }
    }, []);

    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/createquizz`, { title, questions }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log('Quiz created:', response.data);
            setSuccessMessage('Quiz created successfully!');
            setTitle('');
            setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
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

    return (
        <>
            <div className="create-quiz-container">
            {successMessage && <MessageComponent type="success" message={successMessage} />}
            {errorMessage && <MessageComponent type="error" message={errorMessage} />}
                <h2>Create a Quiz</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="quiz-title">Quiz Title</label>
                        <input id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    {questions.map((q, idx) => (
                        <div key={idx} className="question-block">
                            <label htmlFor={`question-${idx}`}>Question {idx + 1}</label>
                            <input
                                id={`question-${idx}`}
                                value={q.questionText}
                                onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[idx].questionText = e.target.value;
                                    setQuestions(newQuestions);
                                }}
                            />
                            <div className="options-block">
                                {q.options.map((option, optIdx) => (
                                    <div key={optIdx} className="option-group">
                                        <label htmlFor={`option-${idx}-${optIdx}`}>Option {optIdx + 1}</label>
                                        <input
                                            id={`option-${idx}-${optIdx}`}
                                            value={option}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[idx].options[optIdx] = e.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="correct-answer-block">
                                <label htmlFor={`correct-answer-${idx}`}>Correct Answer</label>
                                <select
                                    id={`correct-answer-${idx}`}
                                    value={q.correctAnswer}
                                    onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[idx].correctAnswer = Number(e.target.value);
                                        setQuestions(newQuestions);
                                    }}
                                >
                                    {q.options.map((_, optIdx) => (
                                        <option key={optIdx} value={optIdx}>
                                            Option {optIdx + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddQuestion} className="add-question-btn">
                        Add Question
                    </button>
                    <button type="submit" className="submit-btn">Create Quiz</button>
                </form>
            </div>
        </>
    )
}
