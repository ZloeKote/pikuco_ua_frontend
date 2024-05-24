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

function QuizStatsPage() {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const { data: quiz, isLoading: quizIsLoading, isSuccess } = useFetchQuizQuery(pseudoId);
  const { data: indResults } = useFetchIndividualResultsQuery(
    { pseudoId, token },
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
    navigate({
      pathname: ROUTES.QuizStats(quiz.pseudoId),
      search: searchParams.toString().length !== 0 ? "?" + searchParams.toString() : "",
    });
  };

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
                label="Мова вікторини"
              />
            </div>
          )}
        </div>
        {quizIsLoading ? (
          <LinearProgress />
        ) : (
          <ShowQuizStats quiz={quiz} indResults={indResults} language={currLanguage} />
        )}
      </div>
    </div>
  );
}

export default QuizStatsPage;
