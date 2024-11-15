import QuizzesSectionHeader from "../components/QuizzesSectionHeader";
import QuizzesList from "../components/QuizzesList";
import { useFetchPopularQuizzesQuery, useFetchQuizzesQuery } from "../store/index";
import InternalServerError from "../components/errors/InternalServerError";

function MainPage() {
  const {
    data: newestQuizzes,
    isFetching: isFetchingNewest,
    isError: isErrorFetchingNewest,
    error: errorFetchingNewest,
  } = useFetchQuizzesQuery("?sort=NEWEST&pageSize=4");
  const {
    data: popularQuizzes,
    isFetching: isFetchingPopular,
    isError: isErrorFetchingPopular,
    error: errorFetchingPopular,
  } = useFetchPopularQuizzesQuery("?pageSize=4");

  if (isErrorFetchingNewest && isErrorFetchingPopular) {
    if (errorFetchingNewest.status === 500 && errorFetchingPopular.status === 500) {
      return <InternalServerError />;
    }
  }

  return (
    <div className="main-page-layout mx-[3rem] mt-[15px]">
      <div>
        <QuizzesSectionHeader>Популярні вікторини</QuizzesSectionHeader>
        <QuizzesList
          quizzes={popularQuizzes?.quizzes}
          hiddenPagination={true}
          isFetchingQuizzes={isFetchingPopular}
          skeletonItems={4}
        />
      </div>

      <div className="mt-[15px]">
        <QuizzesSectionHeader>Нові вікторини</QuizzesSectionHeader>
        <QuizzesList
          quizzes={newestQuizzes?.quizzes}
          hiddenPagination={true}
          isFetchingQuizzes={isFetchingNewest}
          skeletonItems={4}
        />
      </div>
    </div>
  );
}
// className="bg-dark-main-background"
export default MainPage;
