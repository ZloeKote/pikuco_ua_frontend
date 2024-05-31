import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import RequireAuth from "./components/RequireAuth";
import QuizzesPage from "./pages/QuizzesPage";
import LoginLayout from "./components/layouts/LoginLayout";
import FullLayout from "./components/layouts/FullLayout";
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
import LayoutWithNavigation from "./components/layouts/LayoutWithNavigation";
import TestPage from "./pages/TestPage";
import PageNotFound from "./components/errors/PageNotFound";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route path={ROUTES.Main} element={<LoginLayout />}>
          <Route element={<FullLayout />}>
            <Route path="*" element={<PageNotFound />} />
            
            <Route index element={<MainPage />} />
            <Route path={ROUTES.QuizzesList} element={<QuizzesPage />} />
            <Route path={ROUTES.About} element={<div>About</div>} />
            <Route path={ROUTES.Contacts} element={<div>Contacts</div>} />
            <Route path={ROUTES.Quiz()} element={<QuizPage />} />
            <Route path={ROUTES.QuizStats()} element={<QuizStatsPage />} />
            <Route path={ROUTES.Login} element={<LoginPage />} />
            <Route path={ROUTES.Signup} element={<SignupPage />} />

            {/* user profile routes */}
            <Route path={ROUTES.Profile()}>
              <Route index element={<UserProfilePage />} />
              <Route path={ROUTES.Privacy()} element={<UserPrivacyPage />} />

              <Route path={ROUTES.UserCompletedQuizzes()} element={<UserCQuizzesPage />} />
              <Route path={ROUTES.UserQuizzes()} element={<UserQuizzesPage />} />
              <Route path={ROUTES.UserWishlistedQuizzes()} element={<UserWQuizzesPage />} />
            </Route>
          </Route>

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route element={<LayoutWithNavigation />}>
              <Route path={ROUTES.CreateQuiz} element={<CreateQuizPage />} />
              <Route path={ROUTES.EditQuiz} element={<EditQuizPage />} />
              <Route path={ROUTES.CreateQuizTranslation} element={<CreateQuizTranslationPage />} />
              <Route path={ROUTES.EditQuizTranslation} element={<EditQuizTranslationPage />} />
            </Route>
          </Route>
          <Route path={ROUTES.PlayQuiz()}>
            <Route index element={<PlayQuizPage />} />
          </Route>

          <Route path={"/test"} element={<TestPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
