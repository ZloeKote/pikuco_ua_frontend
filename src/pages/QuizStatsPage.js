import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchQuizQuery, selectCurrentToken } from "../store";
import ShowQuizStats from "../components/ShowQuizStats";
import { useState } from "react";
import QuizNotFound from "../components/errors/QuizNotFound";
import PageNotFound from "../components/errors/PageNotFound";
import QuizHeader from "../components/QuizHeader";
import InternalServerError from "../components/errors/InternalServerError";

function QuizStatsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get("lang") || "");
  const { pseudoId } = useParams();

  const {
    data: quiz,
    isSuccess,
    isFetching: isFetchingQuiz,
    isError: quizIsError,
    error: quizError,
  } = useFetchQuizQuery({ pseudoId, token, param: language !== "" ? `lang=${language}` : "" });

  if (isSuccess && quiz.isRoughDraft) return <PageNotFound />;

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString().length !== 0 ? "?" + searchParams.toString() : "",
    });
  };

  if (quizIsError) {
    if (quizError.status === 404) return <QuizNotFound />;
    else if (quizError.status === 500) return <InternalServerError />;
  }

  return (
    <QuizHeader
      quiz={quiz}
      language={language}
      onChangeLanguage={handleChangeLanguage}
      section="stats"
      isFetchingQuiz={isFetchingQuiz}
    >
      <ShowQuizStats quiz={quiz} language={language} isFetching={isFetchingQuiz} />
    </QuizHeader>
  );
}

export default QuizStatsPage;
