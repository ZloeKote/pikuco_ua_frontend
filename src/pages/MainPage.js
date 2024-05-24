import { LinearProgress } from "@mui/material";
import QuizHeader from "../components/QuizHeader";
import QuizzesList from "../components/QuizzesList";
import { useFetchPopularQuizzesQuery, useFetchQuizzesQuery } from "../store/index";

function MainPage() {
  const { data: newestQuizzes, isSuccess: isSuccessFetchingNewestQuizzes } =
    useFetchQuizzesQuery("?sort=NEWEST&pageSize=4");
  const { data: popularQuizzes, isSuccess: isSuccessFetchingPopularQuizzes } =
    useFetchPopularQuizzesQuery("?pageSize=4");

  return (
    <div className="main-page-layout mx-[3rem] mt-[15px]">
      <div>
        <QuizHeader>Популярні вікторини</QuizHeader>
        {isSuccessFetchingPopularQuizzes ? (
          <QuizzesList quizzes={popularQuizzes.quizzes} hiddenPagination={true} />
        ) : (
          <LinearProgress />
        )}
      </div>

      <div className="mt-[15px]">
        <QuizHeader>Нові вікторини</QuizHeader>
        {isSuccessFetchingNewestQuizzes ? (
          <QuizzesList quizzes={newestQuizzes.quizzes} hiddenPagination={true} />
        ) : (
          <LinearProgress />
        )}
      </div>
    </div>
  );
}
// className="bg-dark-main-background"
export default MainPage;
