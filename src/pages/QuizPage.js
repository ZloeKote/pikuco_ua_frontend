import { useContext, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFetchQuizMainQuery } from "../store/apis/quizzesApi";
import ShowQuiz from "../components/ShowQuiz";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";
import QuizNotFound from "../components/errors/QuizNotFound";
import QuizHeader from "../components/QuizHeader";
import InternalServerError from "../components/errors/InternalServerError";
import SnackbarsContext from "../context/snackbars";

function QuizPage() {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const [language, setLanguage] = useState(searchParams.get("lang") || "");
  const token = useSelector(selectCurrentToken);
  const {
    data: quiz,
    isFetching,
    isError,
    error,
  } = useFetchQuizMainQuery({ pseudoId, token, param: language !== "" ? `lang=${language}` : "" });

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
    searchParams.set("lang", lang);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString().length !== 0 ? "?" + searchParams.toString() : "",
    });
  }
  console.log(searchParams.toString());

  return (
    <QuizHeader
      quiz={quiz}
      language={language}
      onChangeLanguage={handleChangeLanguage}
      section="main"
      isFetchingQuiz={isFetching}
    >
      <ShowQuiz quiz={quiz} language={language} isFetchingQuiz={isFetching} />
    </QuizHeader>
  );
}

export default QuizPage;
