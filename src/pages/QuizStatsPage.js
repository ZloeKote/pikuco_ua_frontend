import { useParams, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Link from "../components/simpleComponents/Link";
import { GoArrowLeft } from "react-icons/go";
import classNames from "classnames";
import { ROUTES } from "../ROUTES";
import { useFetchQuizQuery, useFetchIndividualResultsQuery, selectCurrentToken } from "../store";
import { LinearProgress } from "@mui/material";
import ShowQuizStats from "../components/ShowQuizStats";
import LanguagePicker from "../components/simpleComponents/LanguagePicker";
import { useState } from "react";
import QuizNotFound from "../components/errors/QuizNotFound";

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
  const langParam = searchParams.get("lang") !== null ? "?lang=" + searchParams.get("lang") : "";

  const mainStatClassname =
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover] px-[10px] rounded-md";
  const statClassname = classNames(mainStatClassname, "font-semibold border-b");

  let currLanguage = "";
  if (isSuccess) {
    currLanguage =
      (quiz.languages.includes(searchParams.get("lang")) && searchParams.get("lang")) ||
      (quiz.languages.includes("uk") && "uk") ||
      quiz.language;
  }
  const handleChangeLanguage = (newLang) => {
    searchParams.set("lang", newLang);
    if (!isIndividual) {
      setGeneralParams(searchParams.toString());
      if (individualParams.includes("lang=")) {
        let newIndividualParams = individualParams.split("lang=");
        newIndividualParams = `lang=${newLang}${newIndividualParams[0]}${
          !!newIndividualParams[2] ? newIndividualParams[2].slice(2) : ""
        }`;
        setIndividualParams(newIndividualParams);
      } else
        setIndividualParams(!!individualParams ? individualParams + `&lang=${newLang}` : `lang=${newLang}`);
    } else {
      setIndividualParams(searchParams.toString());
      if (generalParams.includes("lang=")) {
        let newGeneralParams = generalParams.split("lang=");
        newGeneralParams = `lang=${newLang}${newGeneralParams[0]}${
          !!newGeneralParams[2] ? newGeneralParams[2].slice(2) : ""
        }`;
        setGeneralParams(newGeneralParams);
      } else setGeneralParams(!!generalParams ? generalParams + `&lang=${newLang}` : `lang=${newLang}`);
    }
    navigate({
      pathname: ROUTES.QuizStats(quiz.pseudoId),
      search: searchParams.size !== 0 ? "?" + searchParams.toString() : "",
    });
  };
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

  return (
    <div className="flex flex-col items-center mt-10 text-white w-full">
      <div>
        <div className="flex items-center justify-between text-[24px] ml-[15px]">
          <div className="flex gap-[30px]">
            <Link
              className="bg-[--dark-quizcard-background-hover] w-[60px] rounded-full flex justify-center hover:bg-[--dark-link-background-hover]"
              to={ROUTES.QuizzesList}
            >
              <GoArrowLeft className="text-[30px] self-center" />
            </Link>
            <Link className={mainStatClassname} to={ROUTES.Quiz(pseudoId)} params={langParam}>
              Загальна інформація
            </Link>
            <Link className={statClassname} to={ROUTES.QuizStats(pseudoId)}>
              Статистика
            </Link>
          </div>
          {isSuccess && (
            <div>
              <LanguagePicker
                currLanguageCode={currLanguage}
                languageCodes={quiz.languages}
                handleChangeLanguage={handleChangeLanguage}
                disabled={quiz.languages.length === 1}
                title={quiz.languages.length === 1 ? "Вікторина має лише 1 мову" : "Оберіть мову вікторини"}
                label="Мова вікторини"
              />
            </div>
          )}
        </div>
        {quizIsLoading ? (
          <LinearProgress />
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default QuizStatsPage;
