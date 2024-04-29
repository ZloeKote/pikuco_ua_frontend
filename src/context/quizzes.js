// import { createContext, useState, useCallback } from "react";
// import axios from "axios";

// const QuizContext = createContext();

// function Provider({ children }) {
//   const [quizzes, setQuizzes] = useState([]);
//   const [quizResults, setQuizResults] = useState([]);
//   const [quiz, setQuiz] = useState({});

//   const fetchQuizzes = useCallback(async () => {
//     const response = await axios.get("http://localhost:9091/api/v1/quizzes/search");
//     setQuizzes(response.data);
//   }, []);

//   const fetchQuiz = useCallback(async (id) => {
//     const response = await axios.get(`http://localhost:9091/api/v1/quizzes/${id}`);
//     setQuiz(response.data);
//   }, []);

//   const fetchQuizResults = useCallback(async (id) => {
//     const response = await axios.get(`http://localhost:9091/api/v1/quiz-results/${id}`);
//     setQuizResults(response.data);
//   }, []);

//   const quizzesToShare = {
//     quizzes,
//     quiz,
//     quizResults,
//     fetchQuizzes,
//     fetchQuiz,
//     fetchQuizResults,
//   };

//   return <QuizContext.Provider value={quizzesToShare}>{children}</QuizContext.Provider>;
// }

// export { Provider };
// export default QuizContext;
