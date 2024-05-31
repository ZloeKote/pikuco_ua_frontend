import QuizzesList from "../components/QuizzesList";
import QuizFilterSort from "../components/QuizFilterSort";
import { useFetchQuizzesQuery } from "../store";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParamsContext from "../context/searchParams";
import { LinearProgress } from "@mui/material";
import SnackbarsContext from "../context/snackbars";
import QuizNotFound from "../components/errors/QuizNotFound";
import InternalServerError from "../components/errors/InternalServerError"

function QuizzesPage() {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const { quizzesSearchParams, changeQuizzesSearchParams } = useContext(ParamsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isError, error, isFetching, isSuccess } = useFetchQuizzesQuery(quizzesSearchParams);

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
      return <InternalServerError />
    } else if (error.originalStatus) {
      handleEnqueueSnackbar(error.data.error, "error");
    } else {
      handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data}`, "error");
    }
  }

  let quizzes = <div></div>;
  if (isSuccess) {
    if (data?.quizzes.length === 0) {
      quizzes = <QuizNotFound />;
    } else {
      quizzes = (
        <QuizzesList
          gapY="small"
          className="mt-[20px]"
          quizzes={data?.quizzes}
          numPages={data?.numPages}
          handlePageParam={handleChangeParams}
        />
      );
    }
  }

  return (
    <div className="flex flex-col mx-[50px] mt-[40px]">
      <QuizFilterSort isLoading={isFetching} params={quizzesSearchParams} handleParams={handleChangeParams} />
      {error && <span className="text-white">Errors could happens...</span>}
      {isFetching ? <LinearProgress /> : quizzes}
    </div>
  );
}

export default QuizzesPage;
