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


function App() {
    return (
    <Routes>
      <Route path={ROUTES.Main} element={<FullLayout />}>
        {/* Public routes */}
        <Route index element={<MainPage />} />
        <Route path={ROUTES.QuizzesList} element={<QuizzesPage />}/>
        <Route path={ROUTES.About} element={<div>About</div>}/>
        <Route path={ROUTES.Contacts} element={<div>Contacts</div>} />
        <Route path={ROUTES.Quiz()} element={<QuizPage />} />
        <Route path={ROUTES.QuizStats()} element={<QuizStatsPage />} />
        <Route path={ROUTES.Login} element={<LoginPage />} />
        <Route path={ROUTES.Signup} element={<SignupPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
        </Route>
      </Route>
      <Route path={ROUTES.PlayQuiz()} element={<SimpleLayout />}>
        <Route index element={<PlayQuizPage />}/>
      </Route>
    </Routes>
  );
}

export default App;

// Що було
{
  /* <div className="layout font-serif">
      <NavigationPanel />
      <Outlet></Outlet>
      <Footer />
    </div> */
}
