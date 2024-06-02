import { useContext, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useFetchQuizMainQuery } from "../store/apis/quizzesApi";
import ShowQuiz from "../components/ShowQuiz";
import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";
import QuizNotFound from "../components/errors/QuizNotFound";
import QuizHeader from "../components/QuizHeader";
import InternalServerError from "../components/errors/InternalServerError";
import SnackbarsContext from "../context/snackbars";

function QuizPage() {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const [language, setLanguage] = useState(searchParams.get("lang") || "");
  const token = useSelector(selectCurrentToken);
  const {
    data: quiz,
    isFetching,
    isError,
    error,
  } = useFetchQuizMainQuery({ pseudoId, token, param: searchParams.toString() });

  if (isError) {
    if (error.status === 404) return <QuizNotFound />;
    else if (error.status === 500) return <InternalServerError />;
    else {
      handleEnqueueSnackbar("Сталася непередбачувана помилка! Спробуйте ще раз", "error");
      return <div></div>;
    }
  }

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
  };

  return isFetching ? (
    <LinearProgress />
  ) : (
    <QuizHeader quiz={quiz} language={language} onChangeLanguage={handleChangeLanguage} section="main">
      <ShowQuiz quiz={quiz} language={language} />
    </QuizHeader>
  );
}

export default QuizPage;
