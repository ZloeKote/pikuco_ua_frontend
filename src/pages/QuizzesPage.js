import QuizzesList from "../components/QuizzesList";
import QuizFilterSort from "../components/QuizFilterSort";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParamsContext from "../context/searchParams";
import SnackbarsContext from "../context/snackbars";
import QuizNotFound from "../components/errors/QuizNotFound";
import InternalServerError from "../components/errors/InternalServerError";
import { quizzesApi } from "../store/apis/quizzesApi";

function QuizzesPage() {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const { quizzesSearchParams, changeQuizzesSearchParams } = useContext(ParamsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [fetchQuizzes, { data: fetchedQuizzes, isError, error, isFetching, isSuccess }] =
    quizzesApi.endpoints.fetchQuizzes.useLazyQuery();

  useEffect(() => {
    fetchQuizzes(quizzesSearchParams);
  }, [fetchQuizzes, quizzesSearchParams]);

  const handleChangeParams = (newParam) => {
    navigate({
      pathname: location.pathname,
      search: newParam,
    });
    changeQuizzesSearchParams(newParam);
  };

  if (isError) {
    if (error.status === 400) {
      for (let i = 0; i < error.data.length; i++) {
        handleEnqueueSnackbar(error.data[i], "error");
      }
    } else if (error.status === 500) {
      return <InternalServerError />;
    } else if (error.originalStatus) {
      handleEnqueueSnackbar(error.data.error, "error");
    } else {
      handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data}`, "error");
    }
  }

  return (
    <div className="flex flex-col mx-[50px] mt-[40px]">
      <QuizFilterSort isLoading={isFetching} params={quizzesSearchParams} handleParams={handleChangeParams} />
      {error && <span className="text-white">Errors could happens...</span>}
      {isSuccess && fetchedQuizzes?.quizzes.length === 0 ? (
        <QuizNotFound />
      ) : (
        <QuizzesList
          gapY="small"
          quizzesClassName="mt-[10px]"
          quizzes={fetchedQuizzes?.quizzes}
          numPages={fetchedQuizzes?.numPages}
          handlePageParam={handleChangeParams}
          isFetchingQuizzes={isFetching}
          skeletonItems={8}
        />
      )}
    </div>
  );
}

export default QuizzesPage;
