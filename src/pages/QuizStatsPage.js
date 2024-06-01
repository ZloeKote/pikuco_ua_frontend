import { useParams, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../ROUTES";
import { useFetchQuizQuery, useFetchIndividualResultsQuery, selectCurrentToken } from "../store";
import { LinearProgress } from "@mui/material";
import ShowQuizStats from "../components/ShowQuizStats";
import { useState } from "react";
import QuizNotFound from "../components/errors/QuizNotFound";
import QuizHeader from "../components/QuizHeader";

function QuizStatsPage() {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const [isIndividual, setIsIndividual] = useState(location.state?.isIndividual ? true : false);
  const [generalParams, setGeneralParams] = useState(searchParams.toString());
  const [individualParams, setIndividualParams] = useState(
    searchParams.has("lang") ? "lang=" + searchParams.get("lang") : ""
  );
  const {
    data: quiz,
    isLoading: quizIsLoading,
    isSuccess,
    isError: quizIsError,
    error: quizError,
  } = useFetchQuizQuery({ pseudoId, token });
  const { data: indResults } = useFetchIndividualResultsQuery(
    { pseudoId: pseudoId, token: token, param: individualParams },
    {
      skip: location.state?.resultsAfterPassing ? true : false || token ? false : true,
    }
  );

  let currLanguage = "";
  if (isSuccess) {
    currLanguage =
      (quiz.languages.includes(searchParams.get("lang")) && searchParams.get("lang")) ||
      (quiz.languages.includes("uk") && "uk") ||
      quiz.language;
  }
  const handleChangeIndividual = (isIndividual) => {
    setIsIndividual(isIndividual);
    if (isIndividual) {
      navigate({
        pathname: ROUTES.QuizStats(quiz.pseudoId),
        search: !!individualParams ? "?" + individualParams : "",
      });
    } else {
      navigate({
        pathname: ROUTES.QuizStats(quiz.pseudoId),
        search: !!generalParams ? "?" + generalParams : "",
      });
    }
  };
  const handleClickChangeParam = (param) => {
    if (isIndividual) {
      setIndividualParams(param);
      navigate({
        pathname: ROUTES.QuizStats(quiz.pseudoId),
        search: !!param ? "?" + param : "",
      });
    } else {
      setGeneralParams(param);
      navigate({
        pathname: ROUTES.QuizStats(quiz.pseudoId),
        search: !!param ? "?" + param : "",
      });
    }
  };

  if (quizIsError) {
    if (quizError.status === 404) {
      return <QuizNotFound />;
    }
  }

  return quizIsLoading ? (
    <LinearProgress />
  ) : (
    <QuizHeader quiz={quiz} language={currLanguage} section="stats">
      <ShowQuizStats
        quiz={quiz}
        indResults={indResults}
        isIndividual={isIndividual}
        onChangeIndividual={handleChangeIndividual}
        language={currLanguage}
        generalParams={generalParams}
        individualParams={individualParams}
        onChangeParam={handleClickChangeParam}
      />
    </QuizHeader>
  );
}

export default QuizStatsPage;
