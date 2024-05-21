import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import RequireAuth from "./components/RequireAuth";
import QuizzesPage from "./pages/QuizzesPage";
import SimpleLayout from "./components/SimpleLayout";
import FullLayout from "./components/FullLayout";
import PlayQuizPage from "./pages/PlayQuizPage";
import { ROUTES } from "./ROUTES";
import QuizPage from "./pages/QuizPage";
import QuizStatsPage from "./pages/QuizStatsPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserProfilePage from "./pages/UserProfilePage";
import UserPrivacyPage from "./pages/UserPrivacyPage";
import UserCQuizzesPage from "./pages/UserCQuizzesPage";
import UserQuizzesPage from "./pages/UserQuizzesPage";
import UserWQuizzesPage from "./pages/UserWQuizzesPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import CreateQuizTranslationPage from "./pages/CreateQuizTranslationPage";
import EditQuizTranslationPage from "./pages/EditQuizTranslationPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.Main} element={<FullLayout />}>
          <Route index element={<MainPage />} />
          <Route path={ROUTES.QuizzesList} element={<QuizzesPage />} />
          <Route path={ROUTES.About} element={<div>About</div>} />
          <Route path={ROUTES.Contacts} element={<div>Contacts</div>} />
          <Route path={ROUTES.Quiz()} element={<QuizPage />} />
          <Route path={ROUTES.QuizStats()} element={<QuizStatsPage />} />
          <Route path={ROUTES.Login} element={<LoginPage />} />
          <Route path={ROUTES.Signup} element={<SignupPage />} />

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.CreateQuiz} element={<CreateQuizPage />} />
            <Route path={ROUTES.EditQuiz} element={<EditQuizPage />} />
            <Route path={ROUTES.CreateQuizTranslation} element={<CreateQuizTranslationPage />} />
            <Route path={ROUTES.EditQuizTranslation} element={<EditQuizTranslationPage />} />
          </Route>

          {/* user profile routes */}
          <Route path={ROUTES.Profile()}>
            <Route index element={<UserProfilePage />} />
            <Route path={ROUTES.Privacy()} element={<UserPrivacyPage />} />

            <Route path={ROUTES.UserCompletedQuizzes()} element={<UserCQuizzesPage />} />
            <Route path={ROUTES.UserQuizzes()} element={<UserQuizzesPage />} />
            <Route path={ROUTES.UserWishlistedQuizzes()} element={<UserWQuizzesPage />} />
          </Route>
        </Route>

        <Route path={ROUTES.PlayQuiz()} element={<SimpleLayout />}>
          <Route index element={<PlayQuizPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
