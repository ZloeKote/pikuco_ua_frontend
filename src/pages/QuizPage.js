import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Link from "../components/simpleComponents/Link";
import { GoArrowLeft } from "react-icons/go";
import classNames from "classnames";
import { ROUTES } from "../ROUTES";
import { useFetchQuizMainQuery } from "../store/apis/quizzesApi";
import ShowQuiz from "../components/ShowQuiz";
import { LinearProgress } from "@mui/material";
import LanguagePicker from "../components/simpleComponents/LanguagePicker";

function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pseudoId } = useParams();
  const { data: quiz, isLoading, isSuccess } = useFetchQuizMainQuery(pseudoId);

  const mainStatClassname = classNames(
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover]",
    " px-[10px] rounded-md"
  );
  const mainStatDisabledClassname = classNames("px-[10px] rounded-md");
  const mainClassname = classNames(mainStatClassname, "font-semibold border-b");
  const buttonBackClassname = classNames(
    "bg-[--dark-quizcard-background-hover] w-[60px] rounded-full",
    "flex justify-center items-center",
    "hover:bg-[--dark-link-background-hover] hover:cursor-pointer"
  );

  const langParam = searchParams.get("lang") !== null ? "?lang=" + searchParams.get("lang") : "";

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
      pathname: ROUTES.Quiz(quiz.pseudoId),
      search: searchParams.toString().length !== 0 ? "?" + searchParams.toString() : "",
    });
  };

  return (
    <div className="flex flex-col items-center mt-10 text-white w-full">
      <div>
        <div className="flex items-center justify-between text-[24px] ml-[15px]">
          <div className="flex gap-[30px]">
            <Link className={buttonBackClassname} to={ROUTES.QuizzesList}>
              <GoArrowLeft className="text-[30px]" />
            </Link>
            <Link className={mainClassname} to={ROUTES.Quiz(pseudoId)}>
              Загальна інформація
            </Link>
            <Link
              className={isSuccess && !quiz?.isRoughDraft ? mainStatClassname : mainStatDisabledClassname}
              to={ROUTES.QuizStats(pseudoId)}
              params={langParam}
              disabled={!isSuccess || quiz?.isRoughDraft}
            >
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
                disabled={quiz.languages.length === 1}
                title={quiz.languages.length === 1 ? "Вікторина має лише 1 мову" : "Оберіть мову вікторини"}
              />
            </div>
          )}
        </div>
        {isLoading ? <LinearProgress /> : <ShowQuiz quiz={quiz} language={currLanguage} />}
      </div>
    </div>
  );
}

export default QuizPage;
