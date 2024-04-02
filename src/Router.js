import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SimpleLayout from "./components/SimpleLayout";
import MainPage from "./pages/MainPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import QuizStatsPage from "./pages/QuizStatsPage";
import ErrorPage from "./pages/ErrorPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PlayQuizPage from "./pages/PlayQuizPage";
import { ROUTES } from "./ROUTES";

const Router = createBrowserRouter([
  {
    path: ROUTES.Main,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: ROUTES.QuizzesList,
        element: <QuizzesPage />,
      },
      {
        path: ROUTES.About,
        element: <div>About</div>,
      },
      {
        path: ROUTES.Contacts,
        element: <div>Contacts</div>,
      },
      {
        path: ROUTES.Quiz(),
        element: <QuizPage />,
      },
      {
        path: ROUTES.QuizStats(),
        element: <QuizStatsPage />,
      },
      {
        path: ROUTES.Login,
        element: <LoginPage />,
      },
      {
        path: ROUTES.Signup,
        element: <SignupPage />,
      },
    ],
  },
  {
    path: ROUTES.PlayQuiz(),
    element: <SimpleLayout />,
    errorElement: <ErrorPage />,
    children: [{
      index: true,
      element: <PlayQuizPage />,
    }],
  },
]);

export default Router;
