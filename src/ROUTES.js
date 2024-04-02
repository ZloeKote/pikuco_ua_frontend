import QuizzesList from "./components/QuizzesList"

export const ROUTES = {
  Main: "/",
  QuizzesList: "/quizzes",
  Quiz: (pseudoId) => (pseudoId ? `/quizzes/${pseudoId}` : "/quizzes/:pseudoId"),
  QuizStats: (pseudoId) =>  (pseudoId ? `/quizzes/${pseudoId}/stats` : "/quizzes/:pseudoId/stats"),
  PlayQuiz: (pseudoId) =>  (pseudoId ? `/quizzes/${pseudoId}/play` : "/quizzes/:pseudoId/play"),
  Login: "/login",
  Signup: "/signup",
  Profile: (email) => (email ? `/user/${email}` : "/user/:email"),
  About: "/about",
  Contacts: "/contacts",

  Facebook: "https://www.facebook.com/groups/304790906885280/",
  Instagram: "https://www.instagram.com/kotenko_ppp/",
  LinkedIn: "https://www.linkedin.com/in/ілля-котенко-b26519214/",
  X: "https://x.com/CounterStrike",
}