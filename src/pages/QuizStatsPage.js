import { useParams, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../ROUTES";
import { useFetchQuizQuery, useFetchIndividualResultsQuery, selectCurrentToken } from "../store";
import { LinearProgress } from "@mui/material";
import ShowQuizStats from "../components/ShowQuizStats";
import { useState } from "react";
import QuizNotFound from "../components/errors/QuizNotFound";
import PageNotFound from "../components/errors/PageNotFound";
import QuizHeader from "../components/QuizHeader";
import InternalServerError from "../components/errors/InternalServerError";

function QuizStatsPage() {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get("lang") || "");
  const { pseudoId } = useParams();
  const [isIndividual, setIsIndividual] = useState(location.state?.isIndividual ? true : false);
  const [generalParams, setGeneralParams] = useState(searchParams.toString());
  const [individualParams, setIndividualParams] = useState(!!language ? "lang=" + language : "");
  const {
    data: quiz,
    isSuccess,
    isFetching: quizIsFetching,
    isError: quizIsError,
    error: quizError,
  } = useFetchQuizQuery({ pseudoId, token, param: searchParams.toString() });
  const isResultsAfterPassing = !!location.state?.resultsAfterPassing;
  const { data: indResults } = useFetchIndividualResultsQuery(
    { pseudoId: pseudoId, token: token, param: individualParams },
    {
      skip: isResultsAfterPassing ? true : false || token ? false : true,
    }
  );

  if (isSuccess) {
    if (quiz.isRoughDraft) return <PageNotFound />;
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
  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    setGeneralParams(updateQueryParam(generalParams, "lang", lang));
    setIndividualParams(updateQueryParam(individualParams, "lang", lang));
  };

  if (quizIsError) {
    if (quizError.status === 404) return <QuizNotFound />;
    else if (quizError.status === 500) return <InternalServerError />;
  }

  return quizIsFetching ? (
    <LinearProgress />
  ) : (
    <QuizHeader quiz={quiz} language={language} onChangeLanguage={handleChangeLanguage} section="stats">
      <ShowQuizStats
        quiz={quiz}
        indResults={indResults}
        isIndividual={isIndividual}
        onChangeIndividual={handleChangeIndividual}
        isResultsAfterPassing={isResultsAfterPassing}
        generalParams={generalParams}
        individualParams={individualParams}
        onChangeParam={handleClickChangeParam}
      />
    </QuizHeader>
  );
}

export default QuizStatsPage;

function updateQueryParam(query, paramToUpdate, paramValue) {
  console.log(query);
  // Розділяємо параметри на масив
  let paramsArray = query.split("&");
  let langFound = false;

  if (query === "") return `${paramToUpdate}=${paramValue}`;

  // Проходимося по кожному параметру
  for (let i = 0; i < paramsArray.length; i++) {
    let param = paramsArray[i].split("=");

    // Якщо параметр знайдено, замінюємо його значення
    if (param[0] === paramToUpdate) {
      param[1] = paramValue;
      paramsArray[i] = param.join("=");
      langFound = true;
      break;
    }
  }

  // Якщо параметр не знайдено, додаємо його
  if (!langFound) {
    paramsArray.push(`${paramToUpdate}=` + paramValue);
  }

  // Збираємо параметри назад у рядок
  return paramsArray.join("&");
}
