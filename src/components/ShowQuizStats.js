import { useLocation, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import LanguagePicker from "./LanguagePicker";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import QuestionList from "./QuestionList";
import ActiveButton from "./ActiveButton";
import { LinearProgress } from "@mui/material";
import classNames from "classnames";
import { ROUTES } from "../ROUTES";
import avatar from "../img/avatar.png";
import { useFetchQuizResultsQuery } from "../store";

function ShowQuizStats({ quiz, indResults }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { pseudoId } = useParams();

  const [isLiked, setIsLiked] = useState(null);
  const [evaluation, setEvaluation] = useState(12);
  const [isIndividual, setIsIndividual] = useState(location.state?.isIndividual ? true : false);

  const { data: results, isLoading: resultsIsLoading } = useFetchQuizResultsQuery(pseudoId);
  let questions;
  if (isIndividual) {
    questions = location.state?.resultsAfterPassing || indResults.quizResults.questions;
  } else {
    if (!resultsIsLoading && results === undefined) {
      questions = quiz.questions;
    } else {
      questions = results?.quizResults.questions;
    }
  }

  let isIndExists = location.state?.resultsAfterPassing ? true : false || indResults ? true : false;
  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": isLiked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": !isLiked && isLiked != null });
  const indClassname = classNames("mr-[25px] text-[32px]", {
    "text-gray-500 cursor-no-drop": !isIndExists,
    "text-[--dark-text]": isIndExists,
  });

  const languages = [quiz.language];
  quiz.translations?.forEach((translation) => {
    languages.push(translation.language);
  });

  const currLanguage =
    (languages.includes(searchParams.get("lang")) ? searchParams.get("lang") : false) ||
    (languages.includes("uk") ? "uk" : false) ||
    quiz.language;
  const quizTitle =
    currLanguage === quiz.language
      ? quiz.title
      : quiz.translations.find((tr) => tr.language === currLanguage).title;

  const handleChangeLanguage = (newLang) => {
    searchParams.set("lang", newLang);
    navigate({
      pathname: ROUTES.QuizStats(quiz.pseudoId),
      search: searchParams.toString().length !== 0 ? "?" + searchParams.toString() : "",
    });
  };
  const handleClickLike = () => {
    if (isLiked) {
      setIsLiked(null);
      setEvaluation(evaluation - 1);
    } else if (!isLiked && isLiked != null) {
      setIsLiked(true);
      setEvaluation(evaluation + 2);
    } else {
      setIsLiked(true);
      setEvaluation(evaluation + 1);
    }
  };
  const handleClickDislike = () => {
    if (!isLiked && isLiked != null) {
      setIsLiked(null);
      setEvaluation(evaluation + 1);
    } else if (isLiked) {
      setIsLiked(false);
      setEvaluation(evaluation - 2);
    } else {
      setIsLiked(false);
      setEvaluation(evaluation - 1);
    }
  };

  const handleClickIndividual = () => setIsIndividual(true);
  const handleClickGeneral = () => setIsIndividual(false);

  return (
    <div className="mt-[10px]">
      <div className="bg-[--dark-background-primary] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
        <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
          <span className="text-[36px] ml-[15px]">{quizTitle}</span>
          <div className="flex gap-[6rem]">
            <div>
              <LanguagePicker
                currLanguageCode={currLanguage}
                languageCodes={languages}
                handleChangeLanguage={handleChangeLanguage}
              />
            </div>
            <div className="flex items-center text-[36px] gap-[5px]">
              <GoChevronUp className={likeClassname} onClick={handleClickLike} />
              {evaluation}
              <GoChevronDown className={dislikeClassname} onClick={handleClickDislike} />
            </div>
            <div className="quizcard-creator flex items-center border border-[--dark-quizcard-border] w-[170px] h-fit rounded-full self-center mr-3 z-10 bg-[--dark-quizcard-background]">
              <img src={avatar} alt="creator" className="h-[40px] mr-2" />
              <span
                className="quizcard-creator-nickname text-[--dark-text] leading-none text-[20px] italic"
                title={quiz.creator.nickname}
              >
                {quiz.creator.nickname}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="self-center">
            <button className={indClassname} onClick={isIndExists ? handleClickIndividual : null}>
              Індивідуальна
            </button>
            <button className="text-[32px]" onClick={handleClickGeneral}>
              Загальна
            </button>
          </div>
          <div className="flex items-center gap-[20px] self-start ml-[15px] text-[28px]">
            <span>Сортування по:</span>
            <ActiveButton className="w-[150px] h-[50px] rounded-full">Місцю</ActiveButton>
            <ActiveButton className="w-[150px] h-[50px] rounded-full">Назві</ActiveButton>
          </div>
          {resultsIsLoading ? (
            <LinearProgress />
          ) : (
            <QuestionList questions={questions} type={quiz.type} individual={isIndividual} lang={currLanguage} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowQuizStats;
