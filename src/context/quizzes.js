import { createContext, useState, useCallback, useContext } from "react";
import axios from "axios";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";

const QuizContext = createContext();

function Provider({ children }) {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = useCallback(async () => {
    const response = await axios.get('http://localhost:9191/api/v1/quizzes');

    setQuizzes(response.data);
  }, []);

  const quizzesToShare = {
    quizzes,
    fetchQuizzes,
  };

  return <QuizContext.Provider value={quizzesToShare}>{children}</QuizContext.Provider>;
}

export { Provider };
export default QuizContext;
