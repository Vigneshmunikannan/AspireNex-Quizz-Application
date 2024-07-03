import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../PrivateComponents/Header";
import { useAuth } from './Context';
import Error from "../PrivateComponents/Error"
import CreateQuiz from "../PrivateComponents/CreateQuiz"
import QuizList from "../PrivateComponents/QuizList"
import TakeQuiz from "../PrivateComponents/TakeQuiz"
const PrivateRoute = () => {
  const { isValidTokenAvailable } = useAuth();
  return (
    <>
      {isValidTokenAvailable() && <Header />}
      <Routes>
        {
          isValidTokenAvailable() && <>
            <Route path="/create-quiz" element={<CreateQuiz/>} />
            <Route path="/take-quiz/:id" element={<TakeQuiz/>} />
            <Route path="/quiz-list" element={<QuizList/>} />
            <Route path="*" element={<Error />} />
          </>
        }

      </Routes>
    </>
  );
};

export default PrivateRoute;
